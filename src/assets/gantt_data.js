Object.defineProperty(exports, "__esModule", { value: true });
export let projectNewData =  [
    {
        TaskID: 1,
        TaskName: 'Product concept',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('04/21/2019'),
        DeadlineDate: new Date('04/21/2019'),
        AssignedTo: 'Alice',
        Dependency: '',
        Status: 'completed',
        subtasks: [
            { 
                TaskID: 2, 
                TaskName: 'Defining the product and its usage', 
                StartDate: new Date('04/02/2019'), 
                Duration: 3, 
                Progress: 30,
                DeadlineDate: new Date('04/05/2019'),
                AssignedTo: 'Bob',
                Dependency: '',
                Status: 'completed'
            },
            { 
                TaskID: 3, 
                TaskName: 'Defining target audience', 
                StartDate: new Date('04/02/2019'), 
                Duration: 3,
                DeadlineDate: new Date('04/05/2019'),
                AssignedTo: 'Carol',
                Dependency: '',
                Status: 'completed'
            },
            {
                TaskID: 4, 
                TaskName: 'Prepare product sketch and notes', 
                StartDate: new Date('04/02/2019'), 
                Duration: 2,
                Predecessor: '2', 
                Progress: 30,
                DeadlineDate: new Date('04/04/2019'),
                AssignedTo: 'Dave',
                Dependency: 'Task 2',
                Status: 'completed'
            },
        ]
    },
    {
        TaskID: 5, TaskName: 'Concept approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3,4',
        Status: 'notstarted', // Added default status
        Indicators: [
            {
                'date': '04/10/2019',
                'name': 'Design Phase',
                'tooltip': 'Design phase completed',
                'iconClass': 'okIcon e-icons'
            }
        ]
    },
];