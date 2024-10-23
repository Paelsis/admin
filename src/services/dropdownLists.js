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
    {
        label:'List registrations',
        link:'/listCourseRegistrations',
        title:'List the registrations to the the courses'
    },
]

export const dropdownListFestival = [
    {
        label:'Product Type Package',
        link:'/table/tbl_package_product_type',
        title:'Different types of packages'
    },
    {
        label:'Product Type Workshops',
        link:'/table/tbl_workshop_product_type',
        title:'Different types of workshops (or milonga)'
    },
    {
        label:'Create/Release template',
        link:'/festivalTemplate',
        title:'Create festival template and release it to production'
    },
    {
        label:'Create festival registration',
        link:'/FestivalSchema',
        title:'Create a registration (same as used by users)'
    },
    {
        label:'Modify festival registration',
        link:'/festivalChangeRegistration',
        title:'Change a registration',
        hasDivider:true
    },
    {
        label:'List festival registrations',
        link:'/listFestivalRegistrations',
        title:'Create a registration (same as used by users)'
    },
    {
        label:'List workshops and packages',
        link:'/listFestivalRegistrationWorkshops',
        title:'Create a registration (same as used by users)'
    },
]

const publicDir = apiBaseUrl + '/public/images'

export const dropdownListPhoto = [
    {
        label:'Teacher',
        link:'/image',
        subdir:'/images/teacher',
        title:'Add teachres to dir' + publicDir + '/images/teacher'  
    },
    {
        label:'Event',
        link:'/image',
        subdir:'/images/event',
        title:'Add images to dir' + publicDir + '/images/event'  
    },
    {
        label:'School',
        link:'/image',
        subdir:'/images/school',
        title:'Add images to dir' + publicDir + '/images/school'  
    },
    {
        label:'Other',
        link:'/image',
        subdir:'/images/other',
        title:'Other images saved in dir ' + publicDir + '/images/other'    
    },
]

export const dropdownListOther = [
    {
        label:'All texts',
        link:'/textAll',
        title:'Edit all the texts on the web-pages'  
    },
    {
        label:'Mail texts',
        link:'/mailText',
        title:'Edit the text that is sent to course leader and registrant'  
    },
    {
        label:'Example on Homepage Menu',
        link:'/menu',
        title:'The menu shown on first page'  
    },
]

