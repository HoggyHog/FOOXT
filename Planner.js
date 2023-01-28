var preferences=['Jowar Bajra Roti','Multigrain Roti','Ragi Roti', 'Bajra Roti', 'Butter Roti',
'Plain Rice','Jeera Rice','Sprouts Rice', 'Cauliflower Rice', 'Vegetable Rice', 'Brown Rice',
'Dal Fry', 'Lauki Dal', 'Mixed Vegetable Dal', 'Mixed Dal','Amritsari Dal', 
'Watermelon Rind Sabzi', 'Valor Papdi Sabzi', 'Turai Sabzi','Pumpkin Sabzi', 'Raw Papaya Sabzi',
]

/* var preferences=['Multigrain Roti'] */

var used_pref=[]


const data=require('./data/food.json')

var mealPlan=[
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ]
]

const days={
    'Monday':0,
    'Tuesday':1,
    'Wednesday':2,
    'Thursday':3,
    'Friday':4,
    'Saturday':5,
    'Sunday':6
}
const categ={
    'Roti':0,
    'Rice':1,
    'Dal':2,
    'Sabzi':3
}
const timing={
    'Breakfast':0,
    'Lunch':1,
    'Dinner':2
}

const carb_goal=340.44/3
const protein_goal=340.44/3
const fat_goal=76.25/3

meal_day={

}

const check=(db_item,i,item_days)=>{
    if(meal_day[db_item.name]==null){
        console.log(1)
        return true
    }
    else{
        if(meal_day[db_item.name].includes(item_days[i])){
            return false
        }
        else{
            console.log(2)
            return true
        }
    }
}

const Forward=()=>{
    var pref_length=preferences.length
for (k=0;k<pref_length;k++){
    console.log(k,'th run')
    var item=preferences[0]
   
    var db_item=data.filter((el)=>{
        return (el.name==item)
    })
    db_item=db_item[0]
    console.log('Hero ->',db_item.name)
   
    var item_cat=categ[db_item.cat]

    var item_days=db_item.days
    item_days=item_days.map((el)=>{
        return days[el]
    })
    
    var item_timing=db_item.timing
    item_timing=item_timing.map((el)=>{
        return timing[el]
    })

    var cond=true

    for (i in item_days){
        
            for (j in item_timing){
                
                    if(mealPlan[item_days[i]][item_timing[j]][item_cat]==null && check(db_item,i,item_days) && cond){
                        console.log(i,j,item_cat)
                        mealPlan[item_days[i]][item_timing[j]][item_cat]=(db_item.name)
                        used_pref.push(db_item.name)
                        preferences.splice(0,1)
                        if(meal_day[db_item.name]==null){
                            meal_day[db_item.name]=[]
                        }
                        meal_day[db_item.name].push(item_days[i])
                        /* console.log("Used",used_pref)
                        console.log("Pref",preferences)
                        console.log("MEAL DAY",meal_day) */
                        
                        cond=false
                    }
                    else{
                        console.log(2)
                        continue
                    } 
            }
        
    } 
    if(cond==true){
        used_pref.push(db_item.name)
        preferences.splice(0,1)
        k++
    } 
    console.log(mealPlan) 
    console.log(mealPlan)  
} 
console.log('FORWARD FINISHED')
console.log("PREF",preferences)
console.log("USED",used_pref)

}

const Backward=()=>{
    var used_pref_length=used_pref.length
for (k=0;k<used_pref_length;){
    console.log(k,'th run')
    var item=used_pref[0]
   
    var db_item=data.filter((el)=>{
        return (el.name==item)
    })
    db_item=db_item[0]
    console.log('Hero ->',db_item.name)
   
    var item_cat=categ[db_item.cat]

    var item_days=db_item.days
    item_days=item_days.map((el)=>{
        return days[el]
    })
    
    var item_timing=db_item.timing
    item_timing=item_timing.map((el)=>{
        return timing[el]
    })

    var cond=true

    for (i in item_days){
        
            for (j in item_timing){
               
                    if(mealPlan[item_days[i]][item_timing[j]][item_cat]==null && check(db_item,i,item_days) && cond){
                        mealPlan[item_days[i]][item_timing[j]][item_cat]=(db_item.name)
                        preferences.push(db_item.name)
                        used_pref.splice(0,1)
                        /* console.log("Used",used_pref)
                        console.log("Pref",preferences)
                        console.log("MEAL DAY",meal_day) */
                        k++
                        cond=false
                    }
                    else{
                        console.log(2)
                        continue
                    }
                }
        
    } 
    if(cond==true){
        preferences.push(db_item.name)
        used_pref.splice(0,1)
        k++
    } 
    console.log(mealPlan) 
} 


console.log('Backward Over')
console.log("PREF",preferences)
console.log("USED",used_pref)
console.log(mealPlan)
}

for (t=0;t<6;t++){
    Forward()
    Backward()
}

var mealQuant=[
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ],
    [
        [],
        [],
        []
    ]
]

console.log(mealPlan[0][0])

condition=true
for (i=0;i<7 && condition;i++){
    for (j=0;j<3;j++){
        for(k=0;k<4;k++){
            mealQuant[i][j][k]=1
        }
        roti_name=mealPlan[i][j][0]
        rice_name=mealPlan[i][j][1]
        dal_name=mealPlan[i][j][2]
        sabzi_name=mealPlan[i][j][3]

        roti=data.filter((el)=>{
            return (el.name=roti_name)
        })
        rice=data.filter((el)=>{
            return (el.name=rice_name)
        })
        dal=data.filter((el)=>{
            return (el.name=dal_name)
        })
        sabzi=data.filter((el)=>{
            return (el.name=sabzi_name)
        })

        roti=roti[0]
        rice=rice[0]
        dal=dal[0]
        sabzi=sabzi[0]

        current_carb=roti.carb+(rice.carb/2)+dal.carb+sabzi.carb
        const update_carbs=()=>{
            prev=current_carb
            next=current_carb+roti.carb
            if(next<carb_goal){
                current_carb=next
                mealQuant[i][j][0]+=1
                update_carbs()
            }
            else{
                if(next-carb_goal<5){
                    current_carb=next
                    mealQuant[i][j][0]+=1
                }
                else{
                    current_carb=prev
                }
            }
        }
        
        if(current_carb<carb_goal){
            console.log('wow')
            update_carbs()
        }
        
        
        current_prot=roti.prot*mealQuant[i][j][0]+(rice.prot/2)+dal.prot+sabzi.prot
        current_fat=roti.fat*mealQuant[i][j][0]+(rice.fat/2)+dal.fat+sabzi.fat

        if (current_prot>protein_goal){
            condition=false
            for (l=0;l<1;l++){
                console.log("BRUH protein", i,j)
                console.log(current_prot,protein_goal)
            }
        }

        if (current_fat>fat_goal){
            condition=false
            for (l=0;l<1;l++){
                console.log("BRUH fat",i,j)
                console.log(current_fat,fat_goal)
            }
        }
        


    }
}

console.log(mealQuant)






