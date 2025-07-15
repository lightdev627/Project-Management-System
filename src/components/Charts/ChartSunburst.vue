<template>
  <div>
    <div ref="chartContainer" class="sunburst-chart" id="chartId"></div>
    <div class="selected-info" v-if="selectedItem">
      <strong>Selected:</strong> {{ selectedItem.name }}<br/>
      <strong>Depth:</strong> {{ selectedItem.depth }}<br/>
      <strong>Value:</strong> {{ selectedItem.value }}
    </div>
    <div class="legend">
      <div v-for="item in legendItems" :key="item.key" class="legend-item">
        <span class="legend-color" :style="{backgroundColor: item.color}"></span>
        <span class="legend-label">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive, nextTick, onBeforeUnmount} from 'vue';
import * as d3 from 'd3';
import {transition} from "d3-transition";
import {sunburstData} from '@/assets/sunburst_data.js';

const data = reactive(sunburstData);

const chartContainer = ref(null);
const chartSize = ref(400); // default size

const selectedItem = ref(null);
const legendItems = ref([]);

function updateChartSize() {
  if (chartContainer.value) {
    const rect = chartContainer.value.getBoundingClientRect();
    chartSize.value = Math.min(rect.width, 400);
  }
}

function handleResize() {
  updateChartSize();
  createSunburstChart();
}

onMounted(async () => {
  await nextTick();
  updateChartSize();
  createSunburstChart();
  createLegendItems();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

function createLegendItems() {
  // Only use first-level children for legend
  const items = [];
  // Use same color scale as chart
  const colorScale = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, countAllNodes(data) + 1)
  );
  if (data.children) {
    data.children.forEach(child => {
      items.push({
        key: child.name,
        name: child.name,
        color: colorScale(child.name)
      });
    });
  }
  legendItems.value = items;
}

function countAllNodes(node) {
  let count = 1;
  if (node.children) {
    node.children.forEach(child => {
      count += countAllNodes(child);
    });
  }
  return count;
}

let zoomTo;

function createSunburstChart() {
  // Remove previous chart if exists
  const chartDiv = document.getElementById('chartId');
  chartDiv.innerHTML = '';

  const partition = data => {
    const root = d3
        .hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  };

  const root = partition(data);

  root.each(d => (d.current = d));

  const width = chartSize.value;

  const svg = d3
      .create("svg")
      .attr('width', width)
      .attr('height', width)
      .attr("viewBox", [0, 0, width, width])
      .style("font", "14px sans-serif bold");

  const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

  // Use a color scale with all nodes
  const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, countAllNodes(data) + 1)
  );

  const radius = width / 2.2; // make it fit snugly

  const arc = d3
      .arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius / (root.height + 1))
      .outerRadius(d => Math.max(d.y0 * radius / (root.height + 1), d.y1 * radius / (root.height + 1) - 1));

  const path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
      .attr("fill", d => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", d =>
          arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("d", d => arc(d.current));

  path
      .style("cursor", d => d.children ? "pointer" : "default")
      .on("click", clicked)
      .on("mouseover", function(event, d) {
        selectedItem.value = {
          name: d.data.name,
          depth: d.depth,
          value: d.value
        };
      });

  const format = d3.format(",d");

  path.append("title").text(
      d =>
          `${d
              .ancestors()
              .map(d => d.data.name)
              .reverse()
              .join("/")}` + (d.value !== undefined ? `\n${format(d.value)}` : "")
  );

  const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current, radius, root.height))
      .text(d => d.data.name);

  const parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius / (root.height + 1))
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

  function clicked(event, p) {
    parent.datum(p.parent || root);

    root.each(
        d =>
            (d.target = {
              x0:
                  Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
                  2 *
                  Math.PI,
              x1:
                  Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
                  2 *
                  Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth)
            })
    );

    const t = g.transition().duration(750);

    path
        .transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => (d.current = i(t));
        })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d =>
            arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attrTween("d", d => () => arc(d.current));

    label
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current, radius, root.height));

    // Set selected item on click
    selectedItem.value = {
      name: p.data.name,
      depth: p.depth,
      value: p.value
    };
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d, radius, height) {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * radius / (height + 1);
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  chartDiv.appendChild(svg.node());
}
</script>

<style scoped>
  .sunburst-chart {
    margin-bottom: 16px;
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1 / 1;
    position: relative;
  }
  .sunburst-chart > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  }
  .selected-info {
    margin-bottom: 16px;
    font-size: 16px;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    margin-top: 16px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  .legend-color {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-right: 8px;
    border-radius: 3px;
    border: 1px solid #ccc;
  }
  .legend-label {
    font-size: 14px;
  }
</style>