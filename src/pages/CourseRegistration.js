import {useState, useEffect} from 'react'
import CourseSchema from '../components/UNUSED_CourseSchema'
import { useNavigate }  from 'react-router-dom';



const groupByArr = [
    {
        groupBy:'year',
        style:{width:'70%', height:30, marginTop:10, textAlign:'center', margin:'auto', color:'darkBlue', backgroundColor:'lightBlue'}
    }, 
    {
        groupBy:'eventType',
        style:{width:'60%', height:30, marginTop:10, textAlign:'center', margin:'auto', color:'lightBlue', backgroundColor:'blue'}
    }, 
    {
        groupBy:'courseType',
        style:{width:'50%', height:30, marginTop:10, textAlign:'center', margin:'auto', color:'lightBlue', backgroundColor:'darkBlue'}
    }, 
    {
        groupBy:'courseId',
        labelFields:['nameEN'],
        style:{width:'40%', height:30, marginTop:5, textAlign:'center', margin:'auto', color:'blue', backgroundColor:'lightGreen'}
    },
    {
        groupBy:'productId',
        labelFields:['city', 'startDate', 'startTime'],
        style:{width:'30%', height:30, marginTop:5, textAlign:'center', margin:'auto', color:'yellow', backgroundColor:'green'}
    }
]

const cols = ['nameSV', 'city', 'startDate', 'startTime', 'courseType', 'nameEN']

export default () => {
    const navigate = useNavigate()
    const buttons=[          
        {
            label:'Anmälan',
            type:'button',
            onClick:course=>navigate('/registration', {state:course})
        },
        {
            label:'Alert Record',
            type:'button',
            onClick:course=>alert(JSON.stringify(course))
        }
    
    ]
        return(
        <CourseSchema url={'/scheduleCourse'} groupByArr={groupByArr} buttons={buttons} cols={cols}/>
    )
}