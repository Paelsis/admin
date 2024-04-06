import {useState} from 'react'
import ViewSchema from '../components/ViewSchema'
import { useNavigate }  from 'react-router-dom';

const groupByArr = [
    {
        groupBy:'year',
        style:{width:'50%', height:30, marginTop:10, textAlign:'center', margin:'auto', color:'lightBlue', backgroundColor:'blue'}
    }, 
    {
        groupBy:'courseId',
        style:{width:'40%', height:30, marginTop:5, textAlign:'center', margin:'auto', color:'blue', backgroundColor:'lightBlue'}
    },
    {
        groupBy:'productId',
        style:{width:'30%', height:30, marginTop:5, textAlign:'center', margin:'auto', color:'yellow', backgroundColor:'red'}
    }
]

const cols = ['nameSV', 'city', 'startDate', 'startTime']

export default () => {
    const navigate = useNavigate()
    const buttons=[          
        {
            label:'Anmälan',
            type:'button',
            onClick:course=>navigate('/register', {state:course})
        },
        {
            label:'Alert Record',
            type:'button',
            onClick:course=>alert(JSON.stringify(course))
        }
    
    ]
        return(
        <ViewSchema url={'/scheduleCourse'} groupByArr={groupByArr} buttons={buttons} cols={cols}/>
    )
}