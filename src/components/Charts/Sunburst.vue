<script setup>
  import {ref, onMounted, reactive, watch} from 'vue';
  import * as d3 from 'd3';
  import { getItem } from '../../actions/getItem';
  import { useSunburstStore } from '../../store';
  
  const sunburstData = ref({
    name: "Project",
    children: []
  });
  
  const data = reactive(sunburstData);

  const sunburstStore = useSunburstStore();

  const height = ref("100%");

  const selectedItem = ref(null);
  const legendItems = ref([]);
  const sunburstContainer = ref(null);

  const colorHash = {
    completed: "green",
    roadblock: "red",
    delayed: "yellow",
    inprogress: "blue",
    default: "grey"
  }

  onMounted(() => {
    createLegendItems();

    const fields = ["ID", "Title", "timeline_progress", "status", "assigned_to"]

    getItem("Plans", fields).then(res => {
      sunburstStore.setProgressing(res)
    })
  });

  watch(
    () => sunburstStore.progressingData,
    (source) => {
      source.map(item => {
        sunburstData.value.children.push({
          name: item.Title,
          color: colorHash[item.status],
          value: item.timeline_progress,
        })
      })
    },
    {immediate: true, deep: true}
  )

  watch(
    () => sunburstData.value.children.length,
    () => {
      createSunburstChart();
    }
  );

  function createSunburstChart() {
    const partition = data => {
      const root = d3
          .hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);
      return d3.partition().size([2 * Math.PI, root.height + 1])(root);
    };

    const root = partition(sunburstData.value);

    root.each(d => (d.current = d));

    const width = 932;

    const svg = d3
        .create("svg")
        .attr('width', width)
        .attr('height', height.value)
        .attr("viewBox", [0, 0, width, width])
        .style("font", "14px sans-serif bold");

    const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

    const color = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, sunburstData.value.children.length + 1)
    );

    const radius = width / 6;

    const arc = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    const path = g
        .append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => {
          // Use custom color if present, otherwise use color scale
          let node = d;
          while (node.depth > 1) node = node.parent;
          return d.data.color || color(node.data.name);
        })
        .attr("fill-opacity", d =>
            arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr("d", d => arc(d.current))
        .on("mouseover", function(event, d) {
          selectedItem.value = {
            name: d.data.name,
            depth: d.depth,
            value: d.value
          };
          d3.select(this).attr("fill-opacity", 0.7).attr("stroke", "#000").attr("stroke-width", 2);
        })
        .on("mouseout", function(event, d) {d3.select(this).attr("fill-opacity", arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("stroke", null);
        });

    path
        .filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    const format = d3.format(",d");

    path.append("title").text(
        d =>
            `${d
                .ancestors()
                .map(d => d.data.name)
                .reverse()
                .join("/")}\n${format(d.value)}`
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
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name)

    const parent = g
        .append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    g.append("text")
        .attr("class", "project-name")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-size", "18px")
        .text(sunburstData.value.name)
        .style("fill", "#000");

    function clicked(event, p) {

      selectedItem.value = {
        name: p.data.name,
        depth: p.depth,
        value: p.value
      };

      window.alert(`Node Clicked:\nName: ${p.data.name}\nDepth: ${p.depth}\nValue: ${p.value}`);

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
          .attr("fill-opacity", d =>arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("stroke", d => d === p ? "black" : null)
          .attr("stroke-width", d => d === p ? 3 : null)
          .attrTween("d", d => () => arc(d.current));

      label
          .filter(function(d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
          })
          .transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    if (sunburstContainer.value) {
      sunburstContainer.value.innerHTML = '';
      sunburstContainer.value.appendChild(svg.node());
    }

    d3.select(this).classed("selected-node", true);
  }

  function createLegendItems() {
    const items = [];
    if (data.children) {
      const colorScale = d3.scaleOrdinal(
        d3.quantize(d3.interpolateRainbow, data.children.length + 1)
      );
      data.children.forEach(child => {
        items.push({
          key: child.name,
          name: child.name,
          color: child.color || colorScale(child.name)
        });
      });
    }
    legendItems.value = items;
  }
</script>

<template>
  <div style="min-height: 625px">
    <div ref="sunburstContainer" class="sunburst-container"></div>
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

<style scoped>
  .sunburst-chart {
    margin-bottom: 16px;
    width: 100%;
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
  .selected-node {
    stroke: #000;
    stroke-width: 2;
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
    font-size: 14px;  }
  .sunburst-container {
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .selected-node {
  stroke: #000;
  stroke-width: 2;
}
</style>