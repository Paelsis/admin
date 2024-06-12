

export const TEXT = {
    header:{
        SV:'Kursanmälan',
        EN:'Course registration'
    },
    starts:{
        SV:'Kursen startar ',
        EN:'Course starts '
    },
    registration:{
        label:{
            SV:'Anmälan',
            EN:'Registration'
        },
        tooltip:{
            SV:'Anmälan till danskurs',
            EN:'Registrationt to dance course'
        },
    },
    save:{
        label:{
            SV:'Spara',
            EN:'Save'
        },
        tooltip:{
            SV:'Spara värdena i databasen',
            EN:'Save the values in the database'
        },
    },
    role:{
        label:{
            SV:'Dansroll',
            EN:'Dance role'
        },
        tooltip:{
            SV:'Dansroll',
            EN:'Dance role'
        },
        radio:{
            LEADER:{
                SV:'Förare',
                EN:'Leader'
            },
            FOLLOWER:{
                SV:'Följare',
                EN:'Follower'
            },
            BOTH:{
                SV:'Båda roller',
                EN:'Both roles'
            }    
        }
    },    
    firstName:{
        label:{
            SV:'Förnamn',
            EN:'Name'
        },    
        tooltip:{
            SV:'Förnamn på registrant',
            EN:'Name on registrant'
        }    
    },    
    lastName:{
        label:{
            SV:'Efternamn',
            EN:'Sirname'
        },    
        tooltip:{
            SV:'Efternamn på registrant',
            EN:'Sirname on registrant'
        }    
    },    
    email:{
        label:{
            SV:'E-mail',
            EN:'E-mail'
        },    
        tooltip:{
            SV:'E-mail',
            EN:'E-mail'
        }    
    },
    phone:{
        label:{
            SV:'Telefonnummer',
            EN:'Phone number'
        },    
        tooltip:{
            SV:'Telefonnummer',
            EN:'Phone number'
        }    
    },
    address:{
        label:{
            SV:'Adress',
            EN:'Address'
        },    
        tooltip:{
            SV:'Adress',
            EN:'Address'
        }    
    },
    havePartner:{
        label:{
            SV:'Jag har en danspartner',
            EN:'I have a dance-partner'
        },    
        tooltip:{
            SV:'Jag har en danspartner',
            EN:'I have a dance-partner'
        }    
    },
    payForPartner:{
        label:{
            SV:'Jag önskar även betala för min danspartner',
            EN:'I also want to pay for my dance-partner'
        },    
        tooltip:{
            SV:'Jag önskar även betala för min danspartner',
            EN:'I also want to pay for my dance-partner'
        }    
    },
    firstNamePartner:{
        label:{
            SV:'Förnamn danspartner',
            EN:'Name dance-partner'
        },    
        tooltip:{
            SV:'Förnamn på registrant',
            EN:'Name on registrant'
        }    
    },    
    lastNamePartner:{
        label:{
            SV:'Efternamn danspartner',
            EN:'Sirname dance-partner'
        },    
        tooltip:{
            SV:'Efternamn på din danspartner',
            EN:'Sirname on dance-partner'
        }    
    },    
    emailPartner:{
        label:{
            SV:'E-mail danspartner',
            EN:'E-mail dance-partner'
        },    
        tooltip:{
            SV:'E-mail danspartner',
            EN:'E-mail dance-partner'
        }    
    },
    message:{
        label:{
            SV:'Meddelande',
            EN:'Message'
        },    
        tooltip:{
            SV:'Meddelande till kursledaren',
            EN:'Message to course leader'
        }    
    },
    register:{
        label:{
            SV:'Kursanmälan',
            EN:'Register'
        },    
        tooltip:{
            SV:'Kursanmälan',
            EN:'Register'
        }    
    },
    cancel:{
        label:{
            SV:'Avbryt',
            EN:'Cancel'
        },    
        tooltip:{
            SV:'Avbryt',
            EN:'Cancel'
        }    
    },
    testmail:{
        label:{
            SV:'Testa Mail',
            EN:'Test Mail'
        },    
        tooltip:{
            SV:'Testa mail funktionaliteten',
            EN:'Test the mail functionality'
        }    
    },
}

export const registrationFields = language =>([
    {
            type:'radio',
            name:'role',
            label:TEXT.role.label[language],
            radioValues:[
                {label:TEXT.role.radio.FOLLOWER[language], value:'FOLLOWER'}, 
                {label:TEXT.role.radio.LEADER[language], value:'LEADER'},
                {label:TEXT.role.radio.BOTH[language], value:'BOTH'},
            ],
            required:true,
            tooltip: TEXT.role.tooltip[language]
        },
        {
            name:'firstName',
            type:'text',
            required:true,
            label:TEXT.firstName.label[language],
            tooltip: TEXT.firstName.tooltip[language]
    
        },
        {
            name:'lastName',
            type:'text',
            required:true,
            label:TEXT.lastName.label[language],
            tooltip: TEXT.lastName.tooltip[language]
        },
        {
            name:'email',
            type:'email',
            required:true,
            label:TEXT.email.label[language],
            tooltip: TEXT.email.tooltip[language]
    
        },
        {
            name:'phone',
            type:'text',
            label:TEXT.phone.label[language],
            tooltip: TEXT.phone.tooltip[language]
        },
        {
            name:'address',
            type:'text',
            required:true, 
            label:TEXT.address.label[language],
            tooltip: TEXT.address.tooltip[language]
        },
        {
            name:'havePartner',
            type:'checkbox',
            label:TEXT.havePartner.label[language],
            tooltip: TEXT.havePartner.tooltip[language]
        },
        {
            name: 'payForPartner',
            type:'checkbox',
            tooltip: TEXT.payForPartner.tooltip[language],
            label:TEXT.payForPartner.label[language],
            notHiddenIf:'havePartner'
        },
        {
            name:'firstNamePartner',
            type:'text',
            required:true,
            label:TEXT.firstNamePartner.label[language],
            tooltip: TEXT.firstNamePartner.tooltip[language],
            notHiddenIf:'havePartner'
        },
        {
            name:'lastNamePartner',
            type:'text',
            required:true,
            label:TEXT.lastNamePartner.label[language],
            tooltip: TEXT.lastNamePartner.tooltip[language],
            notHiddenIf:'havePartner'
    
        },
        {
            name:'emailPartner',
            type:'email',
            label:TEXT.emailPartner.label[language],
            tooltip: TEXT.emailPartner.tooltip[language],
            notHiddenIf:'havePartner',
        },
        {
            name:'message',
            type:'textarea',
            label:TEXT.message.label[language],
            tooltip: TEXT.message.tooltip[language]
        },
    ])
    
    
