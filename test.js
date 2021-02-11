const groups = [
    { id: 0, name: "All", selected: false },
    { id: -1, name: "All", selected: true },
    { id: 1, name: "Group1", selected: false },
    { id: 2, name: "Group2", selected: false },
    { id: 3, name: "Group3", selected: false },
    { id: 4, name: "Group4", selected: true }
];

const array=groups.map(grp=>grp.id)

console.log(array)