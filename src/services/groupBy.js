// Group by function for a list
export default groupBy;

/*
Example of usage

const pets = [
    {type:"Dog", name:"Spot"},
    {type:"Cat", name:"Tiger"},
    {type:"Dog", name:"Rover"}, 
    {type:"Cat", name:"Leo"}
];
const grouped = groupBy(pets, pet => pet.type);
*/