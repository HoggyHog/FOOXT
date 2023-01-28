
//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

/* var next_btn=document.getElementsByName("next")
next_btn.onClick=next() */

var height, weight, age, gender, lifestyle, goal
var carbs_kcal, proteins_kcal, fats_kcal
var carbs_gram, proteins_gram, fats_gram

const light=1.2
const moderate=1.5
const heavy=1.8



const weight_loss={
	carbs:0.5,
	proteins:0.3,
	fats:0.2
}
const muscle_gain={
	carbs:0.5,
	proteins:0.2,
	fats:0.3
}
const recomp={
	carbs:0.4,
	proteins:0.4,
	fats:0.2
}

const conv={         //converts the unit in kcal to grams (1g of carb -> 4cal (check up on why we're converting kcal tho))
	carbs:.250,
	protein:.250,
	fats:.112
}

var bmr


/* initializations for the 2nd part */
var preferences=[]
var used_pref=[]


import data from './data/food.json' assert { type: 'json' };
console.log(data)

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

var meal_day={

}

var protein_goal, fat_goal, carb_goal, energy_goal




$(".next").click(function(){
	
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
        'transform': 'scale('+scale+')',
        'position': 'absolute'
      });
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		/* easing: 'easeInOutBack' */
	});
});


$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		/* easing: 'easeInOutBack' */
	});
});

const final=()=>{
	energy_goal=Harris(height,weight,age,gender,lifestyle)
	proportion(energy_goal,goal)
	console.log('Gram Values',carbs_gram,fats_gram,proteins_gram)
	console.log('Final Values',carbs_kcal,fats_kcal,proteins_kcal)
}

$(".submit").click(function(){
    height=document.getElementById('height').value
    weight=document.getElementById('weight').value
    age=document.getElementById('age').value
    gender=document.getElementById('gender').value
    lifestyle=document.getElementById('lifestyle').value
    goal=document.getElementById('goal').value

    console.log('height: ',height)
    console.log('goal: ',goal)
	const items=document.querySelectorAll(".item")
	items.forEach((item)=>{
		if(item.classList.contains('checked')){
			preferences.push(item.dataset.value)
		}
		
	})
	final()
	fixMeal()
	Quantize()
	console.log(preferences)
	console.log("meal Plan",mealPlan)
	console.log("meal Quant",mealQuant)
    console.log(1)	
    var big_box= document.getElementsByClassName('main')[0]
    big_box.classList.add('inactive')
    console.log(2)
    var menu_div=document.getElementsByClassName('show-stats')[0]
    menu_div.classList.remove('inactive')
    console.log(3)

    document.getElementsByClassName('menu-kcal')[0].innerHTML="Energy goal = "+Math.round(energy_goal*100)/100+" KCAL"
    document.getElementsByClassName('menu-carb')[0].innerHTML="Carbohydrate goal = "+Math.round(carb_goal*100)*3/100+" grams"
    document.getElementsByClassName('menu-prot')[0].innerHTML="Protein goal = "+Math.round(protein_goal*100)*3/100+" grams"
    document.getElementsByClassName('menu-fat')[0].innerHTML="Fat goal = "+Math.round(fat_goal*100)*3/100+" grams"

	
});

$(".show-menu").click(function(){
    var big_box= document.getElementsByClassName('show-stats')[0]
    big_box.classList.add('inactive')
    var menu_div=document.getElementsByClassName('menu-deal')[0]
    menu_div.classList.remove('inactive')

    set_values(0)

})

const Harris =(height, weight, age, gender,lifestyle)=>{
	console.log('Harris')
    if(gender=="Male"){
        bmr=66.4730 + 13.7516*weight + 5.0033*height - 6.7550*age
		console.log('male in')
    }
    else if(gender=='Female'){
        bmr=655.0955 + 9.5634*weight + 1.8496*height - 4.6756*age
    }
	
	if(lifestyle=='Light'){
		bmr=bmr*light
	}
	if(lifestyle=='Moderate'){
		bmr=bmr*moderate
	}
	if(lifestyle=='High'){
		bmr=bmr*heavy
	}
	console.log(1,bmr)
	return bmr
}

const proportion=(bmr,goal)=>{
	console.log(bmr)
	if(goal=="Weight Loss"){
		carbs_kcal=bmr*weight_loss.carbs
		proteins_kcal=bmr*weight_loss.proteins
		fats_kcal=bmr*weight_loss.fats
	}
	if(goal=='Muscle Gain'){
		carbs_kcal=bmr*muscle_gain.carbs
		proteins_kcal=bmr*muscle_gain.proteins
		fats_kcal=bmr*muscle_gain.fats
	}
	if(goal=='Recomposition'){
		carbs_kcal=bmr*recomp.carbs
		proteins_kcal=bmr*recomp.proteins
		fats_kcal=bmr*recomp.fats
	}
	console.log(2,carbs_kcal)
	carbs_gram=carbs_kcal*conv.carbs
	console.log(3,carbs_gram)
	proteins_gram=proteins_kcal*conv.protein
	fats_gram=fats_kcal*conv.fats

	carb_goal=carbs_gram/3
	protein_goal=proteins_gram/3
	fat_goal=fats_gram/3

}


var preferences=['Jowar Bajra Roti','Multigrain Roti','Ragi Roti', 'Bajra Roti', 'Butter Roti',
'Plain Rice','Jeera Rice','Sprouts Rice', 'Cauliflower Rice', 'Vegetable Rice', 'Brown Rice',
'Dal Fry', 'Lauki Dal', 'Mixed Vegetable Dal', 'Mixed Dal','Amritsari Dal', 
'Watermelon Rind Sabzi', 'Valor Papdi Sabzi', 'Turai Sabzi','Pumpkin Sabzi', 'Raw Papaya Sabzi',
]

/* var preferences=['Multigrain Roti'] */


/* Functions for the 2nd part */



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
            return true
        }
    }
}

const Forward=()=>{
    var pref_length=preferences.length
for (var k=0;k<pref_length;k++){
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

    for (var i in item_days){
        
            for (var j in item_timing){
                
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
} 
console.log('FORWARD FINISHED')
console.log("PREF",preferences)
console.log("USED",used_pref)

}

const Backward=()=>{
    var used_pref_length=used_pref.length
	for (var k=0;k<used_pref_length;){
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

		for (var i in item_days){
			
				for (var j in item_timing){
				
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

const fixMeal=()=>{
	for (var t=0;t<10;t++){
		Forward()
		Backward()
	}
}


const Quantize=()=>{
	var condition=true
for (var i=0;i<7 && condition;i++){
    for (var j=0;j<3;j++){
        for(var k=0;k<4;k++){
            mealQuant[i][j][k]=1
        }

        var roti_name=mealPlan[i][j][0]
        var rice_name=mealPlan[i][j][1]
        var dal_name=mealPlan[i][j][2]
        var sabzi_name=mealPlan[i][j][3]

        var roti=data.filter((el)=>{
            return (el.name==roti_name)
        })
        var rice=data.filter((el)=>{
            return (el.name==rice_name)
        })
        var dal=data.filter((el)=>{
            return (el.name==dal_name)
        })
        var sabzi=data.filter((el)=>{
            return (el.name==sabzi_name)
        })

        roti=roti[0]
        rice=rice[0]
        dal=dal[0]
        sabzi=sabzi[0]

        var current_carb=roti.carb+(rice.carb/4)+dal.carb+sabzi.carb
        const update_carbs=()=>{
            var prev=current_carb
            var next=current_carb+roti.carb
            if(next<carb_goal){
                current_carb=next
                mealQuant[i][j][0]+=1
                update_carbs()
            }
            else{
                if(carb_goal-next<5){
                    current_carb=next
                    mealQuant[i][j][0]+=1
                }
                else{
                    current_carb=prev
                }
            }
        }
        
        if(current_carb<carb_goal){
            console.log("carb count")
            console.log(i,j,current_carb,carb_goal,roti.carb)
            update_carbs()
        }
        
        console.log('OK')
        
        var current_prot=roti.prot*mealQuant[i][j][0]+(rice.prot/4)+dal.prot+sabzi.prot
        var current_fat=roti.fat*mealQuant[i][j][0]+(rice.fat/4)+dal.fat+sabzi.fat

        if (current_prot>protein_goal){
            condition=false
            for (var l=0;l<1;l++){
                console.log("BRUH protein", i,j)
                console.log(current_prot,protein_goal)
            }
        }

        if (current_fat>fat_goal){
            condition=false
            for (var l=0;l<1;l++){
                console.log("BRUH fat",i,j)
                console.log(current_fat,fat_goal)
            }
        }
        
    }
	condition=true
}
}

//the menu part
console.log('hi')
var mon_btn=document.getElementsByClassName('mond-btn')[0]
var tue_btn=document.getElementsByClassName('tue-btn')[0]
var wed_btn=document.getElementsByClassName('wed-btn')[0]
var thur_btn=document.getElementsByClassName('thur-btn')[0]
var fri_btn=document.getElementsByClassName('fri-btn')[0]
var sat_btn=document.getElementsByClassName('sat-btn')[0]
var sun_btn=document.getElementsByClassName('sun-btn')[0]

var mon_menu=document.getElementsByClassName('mon-menu')[0]
var tue_menu=document.getElementsByClassName('tue-menu')[0]
var wed_menu=document.getElementsByClassName('wed-menu')[0]
var thur_menu=document.getElementsByClassName('thur-menu')[0]
var fri_menu=document.getElementsByClassName('fri-menu')[0]
var sat_menu=document.getElementsByClassName('sat-menu')[0]
var sun_menu=document.getElementsByClassName('sun-menu')[0]



var current=[mon_menu]

const set_values=(index)=>{
    console.log(5)

    var bf_roti=document.getElementsByClassName('bf-roti')[index]
    var bf_rice=document.getElementsByClassName('bf-rice')[index]
    var bf_dal=document.getElementsByClassName('bf-dal')[index]
    var bf_sabzi=document.getElementsByClassName('bf-sabzi')[index]

    var ln_roti=document.getElementsByClassName('ln-roti')[index]
    var ln_rice=document.getElementsByClassName('ln-rice')[index]
    var ln_dal=document.getElementsByClassName('ln-dal')[index]
    var ln_sabzi=document.getElementsByClassName('ln-sabzi')[index]

    var dn_roti=document.getElementsByClassName('dn-roti')[index]
    var dn_rice=document.getElementsByClassName('dn-rice')[index]
    var dn_dal=document.getElementsByClassName('dn-dal')[index]
    var dn_sabzi=document.getElementsByClassName('dn-sabzi')[index]

    bf_roti.innerHTML=mealPlan[index][0][0] + " - " + mealQuant[index][0][0] + "servings"
    bf_rice.innerHTML=mealPlan[index][0][1] + " - " + mealQuant[index][0][1] + "servings"
    bf_dal.innerHTML=mealPlan[index][0][2] + " - " + mealQuant[index][0][2] + "servings"
    bf_sabzi.innerHTML=mealPlan[index][0][3] + " - " + mealQuant[index][0][3] + "servings"

    ln_roti.innerHTML=mealPlan[index][1][0] + " - " + mealQuant[index][1][0] + "servings"
    ln_rice.innerHTML=mealPlan[index][1][1] + " - " + mealQuant[index][1][1] + "servings"
    ln_dal.innerHTML=mealPlan[index][1][2] + " - " + mealQuant[index][1][2] + "servings"
    ln_sabzi.innerHTML=mealPlan[index][1][3] + " - " + mealQuant[index][1][3] + "servings"

    dn_roti.innerHTML=mealPlan[index][2][0] + " - " + mealQuant[index][2][0] + "servings"
    dn_rice.innerHTML=mealPlan[index][2][1] + " - " + mealQuant[index][2][1] + "servings"
    dn_dal.innerHTML=mealPlan[index][2][2] + " - " + mealQuant[index][2][2] + "servings"
    dn_sabzi.innerHTML=mealPlan[index][2][3] + " - " + mealQuant[index][2][3] + "servings"


    
}



mon_btn.onclick=()=>{
    current[0].classList.add('inactive')
    current.splice(0,1)
    current.push(mon_menu)
    mon_menu.classList.remove('inactive')

    set_values(0)

}

tue_btn.onclick=()=>{
    current[0].classList.add('inactive')
    current.splice(0,1)
    current.push(tue_menu)
    tue_menu.classList.remove('inactive')

    set_values(1)
}

wed_btn.onclick=()=>{
    current[0].classList.add('inactive')
    current.splice(0,1)
    current.push(wed_menu)
    wed_menu.classList.remove('inactive')

    set_values(2)
}
thur_btn.onclick=()=>{
    current[0].classList.add('inactive')
    current.splice(0,1)
    current.push(thur_menu)
    thur_menu.classList.remove('inactive')

    set_values(3)
}
fri_btn.onclick=()=>{
    current[0].classList.add('inactive')
    current.splice(0,1)
    current.push(fri_menu)
    fri_menu.classList.remove('inactive')

    set_values(4)
}
sat_btn.onclick=()=>{
    current[0].classList.add('inactive')
    current.splice(0,1)
    current.push(sat_menu)
    sat_menu.classList.remove('inactive')

    set_values(5)
}
sun_btn.onclick=()=>{
    current[0].classList.add('inactive')
    current.splice(0,1)
    current.push(sun_menu)
    sun_menu.classList.remove('inactive')

    set_values(6)
}










