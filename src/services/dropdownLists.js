const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

export const dropdownListCourse = [
    {
        label:'Course Type',
        link:'/table/tbl_course_type',
        hasDivider:true,
        title:'Definition of the different course types (Basic, Continuation, Advanced)'
    },
    {
        label:'Course Definitions',
        link:'/table/tbl_course_def',
        title:'Definition of your courses'
    },
    {
        label:'Create template',
        link:'/courseTemplate',
        hasDivider:true,
        title:'Create course template and release it to production',
        hasDivider:true

    },
    {
        label:'Course Schema',
        link:'/courseSchema',
        title:'Course schema with registration buttons to the different courses'
    },
]

export const dropdownListFestival = [
    {
        label:'Product Type',
        link:'/table/tbl_product_type_festival',
        title:'Different product types on festival (Used for summation of prices for packages)'
    },
    {
        label:'Create/Release template',
        link:'/festivalTemplate',
        title:'Create festival template and release it to production'
    },
    {
        label:'Modify a registration',
        link:'/festivalChangeRegistration',
        title:'Change a registration',
        hasDivider:true
    },
    {
        label:'Create a registration',
        link:'/festivalCreateRegistration',
        title:'Create a registration (same as used by users)'
    },
    /*
    {
        label:'List active workshops',
        link:'/table/tbl_workshop',
        title:'Edit the workshop table (defined by Create template)'  
    },
    {
        label:'List active packages',
        link:'/table/tbl_package',
        title:'Edit the package table (defined by Create template)'  
    },
    */
]

export const dropdownListOther = [
    {
        label:'Text',
        link:'/text',
        title:'Edit all the texts on the web-pages'  
    },
    {
        label:'Image',
        link:'/image',
        title:'Add images to dir' + apiBaseUrl + '/public/images/'  
    },
]

