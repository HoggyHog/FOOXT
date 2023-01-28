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

const data=require('./data/food.json')

const carb_goal=340.44
const protein_goal=340.44
const fat_goal=76.25

roti_name="Butter Roti"
rice_name="Jeera Rice"
dal_name="Lauki Dal"
sabzi_name="Raw Papaya Sabzi"

roti=data.filter((el)=>{
    return (el.name==roti_name)
})
rice=data.filter((el)=>{
    return (el.name==rice_name)
})
dal=data.filter((el)=>{
    return (el.name==dal_name)
})
sabzi=data.filter((el)=>{
    return (el.name==sabzi_name)
})

roti=roti[0]
rice=rice[0]
dal=dal[0]
sabzi=sabzi[0]

for(k=0;k<4;k++){
    mealQuant[0][0][k]=1
}
console.log(roti)
current_carb=roti.carb+(rice.carb/2)+dal.carb+sabzi.carb
console.log(current_carb)
console.log(carb_goal)
current_prot=roti.prot+rice.prot+dal.prot+sabzi.prot
current_fat=roti.fat+rice.fat+dal.fat+sabzi.fat

const update_carbs=()=>{
    console.log(2)
    prev=current_carb
    next=current_carb+roti.carb
    if(next<carb_goal){
        console.log(3)
        current_carb=next
        mealQuant[0][0][0]+=1
        update_carbs()
    }
    else{
        if(next-carb_goal<5){
            console.log(4)
            current_carb=next
            mealQuant[0][0][0]+=1
        }
        else{
            console.log(5)
            current_carb=prev
        }
    }
}

if(current_carb<carb_goal){
    console.log(1)
    update_carbs()
}

console.log(current_carb,carb_goal)
console.log(mealQuant[0][0])