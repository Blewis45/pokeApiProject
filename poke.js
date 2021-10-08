
//let highestStat = [255,190,230,194,230,180];


/// When the user presses the search button run this





function changePokemon(pokeName, parentContainer){

    console.log(`${pokeName} container ${parentContainer}`);
    fetch('https://pokeapi.co/api/v2/pokemon/' + pokeName.toLowerCase())
    .then(response => response.json())
    .then(data => {
        
     

        let name = data.name;
        let abilities = [];
        let moves = [];
        let types = data.types;
        let type_name;
        //let statList = parentContainer.querySelector(".statcard>ul");
        let statCard = parentContainer.querySelector(".statcard")
        let image_tag = parentContainer.querySelector(".img2");
        let capitalizedName = capitalizeWord(name);
        let name_tag = parentContainer.querySelector("#name").innerText = capitalizedName;
        let type_tag = parentContainer.querySelector("#type");
        let ability_parent = parentContainer.querySelector(".ability_parent");
        let ability_list = parentContainer.querySelector("#ability_list");
        let mvContainer = parentContainer.querySelector(".moveContainer");
        let mvSelect = parentContainer.querySelector("select"); ///<---I hate you so much.
        let statUl = document.createElement("ul");
        statUl.classList.add("RandomUl");
        
        
        image_tag.src = data.sprites.front_default;
       

        console.log(ability_parent + "ability parent");

        

        /*

        Checks to see if pokemon has two types. If it can't find the second type. The type name is the first type
        and display on the document.
        If it find the second type, add a "/" and the second type to the document.

        Not relatetd to the problem.gh

        */
        if(types[1] === undefined){
            type_name = capitalizeWord(types[0].type.name);
            
        }
        else{
            type_name = capitalizeWord(types[0].type.name) + "/ "+ capitalizeWord(types[1].type.name);
        }

        console.log("The type name " + type_name);
        type_tag.textContent = type_name;

     
        ability_parent.innerHTML = "";
        

        for(d in data.abilities){
            let currAbName = data.abilities[d].ability.name;
            let url = data.abilities[d].ability.url;
            console.log(`Changed ability name ${currAbName}`);
            
            getAbilityDesc(url,currAbName,ability_parent);///<-This wasn't that hard.

        }

        
        


        //// Removes the current contents of the moveContainer and MvSelect.
        //// So none of the old moves from the previous pokemon are attached to the new pokemon the user search for
        
        //Note:.innerHTML = "" removes everthing inside the element when used. 
        //resetTag function might be useful for removing certain tags for later.
        
        mvContainer.innerHTML = "";
        mvSelect.innerHTML = "";


        

        //Adds the dropdown menu <select> to the moveContainer
        mvContainer.append(mvSelect);
        
  


        for(m in data.moves){
            let currMoveName = data.moves[m].move.name;
            let murl = data.moves[m].move.url;
            currMoveName = currMoveName.charAt(0).toUpperCase() + currMoveName.slice(1);
            currMoveName = currMoveName.replace("-", " ");
           
           
            getMoveDesc(murl,currMoveName,mvContainer,mvSelect);

            
        }

      

    
            mvSelect.addEventListener("change",function(){

            
                let previousCard = mvContainer.querySelector(".moveCard");
                let selectedName = event.target.value;
               
                console.log(previousCard);
                console.log(selectedName + "Name");
                let selectedCard = mvContainer.querySelector(`[for="${selectedName}"]`);


                console.log(selectedCard + "Selected Card");

                if(previousCard != null){
                    previousCard.className = "hiddenCard";
                    console.log(previousCard);
                }
                
                selectedCard.className = "moveCard";
                
                console.log(selectedName); 
                console.log(selectedCard);
        })

    //})

        
        statCard.innerHTML = "";

       
        for (let index = 0;index < 6;index++) {
            let currStat = data.stats[index];
            let currName = currStat.stat.name;
            let capStatName = currName.charAt(0).toUpperCase() + currName.slice(1);
            capStatName = capStatName.replace("-", " ");

            let statli = document.createElement("li");
            let statNameDiv = document.createElement("div");
            let statNumberDiv = document.createElement("div");

            statli.className = "statListItem";
            
            statNameDiv.className = "statName";
            statNumberDiv.className = "statNumber";
            
            statNameDiv.textContent = capStatName + ": ";
            statNumberDiv.innerHTML = currStat.base_stat;
            //statli.textContent = capStatName + ": " + currStat.base_stat;

            statli.append(statNameDiv);
            statli.append(statNumberDiv);
            let barSize = (currStat.base_stat/255) * 200;
    
            let barDiv = document.createElement("div");
           
            barDiv.style.width = barSize+"px";
            barDiv.style.height = "1rem";
            barDiv.style.backgroundColor = "green";

            statli.append(barDiv);
            statUl.append(statli);
        }

        statCard.append(statUl);

        
       let mytypes =  types.map((type) => {
        return type.type;
    })

   


        getMultiplyier(mytypes,statCard);
    

        
        })
       
    }



function getMultiplyier(pokeType,parent){


    console.log(parent.firstChild);
    let multiplier = {
        defense:{}
    }

    

    let weakTag = document.createElement("div");
    //document.querySelector(".weakness");
    weakTag.className = "weakness"
    weakTag.innerHTML = "";
    pokeType.forEach(type => {
        
        let typeName = type.name;
        let typeUrl = type.url;
    
       

        fetch(typeUrl)
        .then(response => response.json())
        .then(qdata =>{

            console.log(typeName);
            let damage_relations = qdata.damage_relations;
            let double_damage_from = damage_relations.double_damage_from;
            let half_damage_from = damage_relations.half_damage_from;
            let no_damage_from = damage_relations.no_damage_from;

            console.log(double_damage_from);

            double_damage_from.forEach(type => {
                
                if(multiplier.defense.hasOwnProperty(type.name))
                    multiplier.defense[type.name] *= 2;
    
                    else
                    multiplier.defense[type.name] = 2;
            });

            half_damage_from.forEach(type => {
                
                if(multiplier.defense.hasOwnProperty(type.name))
                    multiplier.defense[type.name] *= .5;
    
                    else
                    multiplier.defense[type.name] = .5;
            });

            no_damage_from.forEach(type => {
                
                if(multiplier.defense.hasOwnProperty(type.name))
                    multiplier.defense[type.name] *= 0;
    
                    else
                    multiplier.defense[type.name] = 0;
            });


            //let statCard = document.querySelector(".statcard");
            
            for(let key in multiplier.defense){

                console.log(key);

                let currKeyValue = multiplier.defense[key];

                if(currKeyValue === 1){

                    console.log("in the if " + currKeyValue);
                    delete multiplier.defense[key];
                }

                console.log(currKeyValue);
            }

            console.log(multiplier);

            let fourTimes = [];
            let twoTimes = [];
            let immune = [];
            let halfres = [];
            let quadres = [];

            for(item of Object.keys(multiplier.defense)){
                
                let currValue = multiplier.defense[item];
                if (currValue === 2)
                    twoTimes.push(item);
                if (currValue === 4)
                    fourTimes.push(item);
                if (currValue === .5)
                    halfres.push(item);
                if (currValue === .25)
                    quadres.push(item);
                if (currValue === 0)
                    immune.push(item);    

            
            }

            weakTag.innerHTML = "";
            
            let ulWeakTag = document.createElement("ul");
            
            weakTag.innerHTML += printWeaknessList(fourTimes,4);
            weakTag.innerHTML += printWeaknessList(twoTimes,2);
            weakTag.innerHTML += printWeaknessList(immune,0);
            weakTag.innerHTML += printWeaknessList(halfres,.5);
            weakTag.innerHTML += printWeaknessList(quadres,.25);

            



        

            ulWeakTag.append(weakTag);
            parent.append(ulWeakTag);

         
            

   
            console.log(multiplier);
    })
        
    });
    
    

}






function printWeaknessList(myArray,num){

    let weaknessString = ""
    if(myArray.length === 0)
        return "";
    for (item of myArray){
        weaknessString += `<li>${num}x: ${item}</li>`
    }

    console.log("Weak " + weaknessString);
    return weaknessString;
}

function capitalizeWord(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function resetTags(statcard) {
    while (statcard.firstChild) {
        statcard.removeChild(statcard.firstChild);
    }
}

function getAbilityDesc(url,abName,parentTag) {
    let desc;

    console.log(parentTag + "Parent");
    //let parentTag = document.getElementById("abilities");
    abName = abName.charAt(0).toUpperCase() + abName.slice(1);
    abName = abName.replace("-"," ");
    //resetTags(parentTag);
    parentTag.innerHTML = "";
    fetch(url)
        .then(response => response.json())
        .then(data2 => {

            let currDes;
            if(abName === "Overgrow")
            {
                currDes = data2.effect_entries[0].effect;
            }

            else{
                currDes = data2.effect_entries[1].effect;
            }


            
            let abTag = document.createElement("li");
            let ul = document.createElement("ul");
            let descTag = document.createElement("li");
            

            abTag.className = "lihead";
            abTag.innerText = abName;
            descTag.innerText = currDes;
            abTag.append(ul);
            ul.append(descTag);

            


            parentTag.append(abTag);
            
            console.log(abName);
            console.log(currDes);
            
            
            
        });
}



function printTypeWeakness(half, half_str) {
    for (let index = 0; index < half.length; index++) {

        if(index === half.length - 1){
            let type_name = capitalizeWord(half[index].name);
            half_str = half_str + type_name;    
        }
        else{

            let type_name = capitalizeWord(half[index].name);
            half_str = half_str + type_name + ", ";    
        }
        


    }
    return half_str;
}


function getMoveDesc(url,mvName,moveContainer,select){
    
   


    /*
    moveCard is a flex box that contains all the data for that move. divMoveTag is the name of the move.
    divDesc is the description of the move
    divPowTag is the damage that it does
    moveOption is one of the options in the dropdown menu. 
    */

    
    let moveCard = document.createElement("div");
    let divMoveTag = document.createElement("div");
    let divDescTag = document.createElement("div");
    let divPowTag = document.createElement("div");
    let moveOption = document.createElement("option");




    //Set the current Move Tag to current move. 
    //Set one of the option in the drop down menu to the current move 
    divDescTag.className = "moveDesc";
    divMoveTag.textContent = mvName;
    moveOption.textContent = mvName;
    moveOption.value = mvName;


    divMoveTag.className = "moveName";

    //Sets the attritbute so I can find it using queryselector. Then add it to the page
    moveCard.setAttribute("for",mvName);
    select.append(moveOption);
    
    
    
    
    
    fetch(url)
    .then(response => response.json())
    .then(moveData => {
        

        ///The move fetch 
        let move_Desc = moveData.effect_entries[0].effect;
        let effect_chance = moveData.effect_chance;
        divPowTag.textContent = 'Power: ' + moveData.power;
        
        
        
        
        
        
        if(effect_chance !== null){
            move_Desc = move_Desc.replace("$effect_chance",String(effect_chance));
            
        }
        //console.log("Description: " + moveData.effect_entries[0].effect);
        
        if(mvName === "Substitute"){
            divDescTag.textContent = "Transfers 1/4 the user's max HP into a"+ 
            "doll that absorbs damage and causes most negative move effects to fail"
        }
        else if(mvName === "Reversal"){
            divDescTag.textContent = "Inflicts regular damage. Power varies inversely with the user's proportional remaining HP."
        }
        else{
            
            divDescTag.textContent = move_Desc;
        }
        
        


        /*
        Now
        */
        
        divMoveTag.append(divPowTag);
        moveCard.append(divMoveTag);
        
        moveCard.append(divDescTag);
        
        moveContainer.append(moveCard);
        
        moveCard.className = "hiddenCard";////<-----
        
        
        
        
    });
    
    
    
    
}





function addPokemon(){

    let parent = document.querySelector(".pokeContainer");
    let searchTerm = document.getElementById("search");
    let name = searchTerm.value.toLowerCase();

    let parentHead = document.createElement("div");

    let searchContainer = document.createElement("div");
    let labelDiv = document.createElement("label");
    let inputText = document.createElement("input")
    let thisButton = document.createElement("button");

    searchContainer.classList.add("searchContainer");
    labelDiv.setAttribute("for","search2");
    inputText.setAttribute("type","text");
    thisButton.textContent = "Search Me";

    
    
    searchContainer.append(labelDiv);
    searchContainer.append(inputText);
    searchContainer.append(thisButton);

    
    

    let pokeTitle = document.createElement("h1");
    let pokeType = document.createElement("h1");
    let typeName;

    pokeTitle.id = "name";
    pokeType.id = "type";


    let cardContainer = document.createElement("div");
    cardContainer.className ="cardContainer2";

    let imagecard2 = document.createElement("div");
    let img2 = document.createElement("img");
    imagecard2.className = "imgcard2";

    parentHead.className = "name_Head";

    parentHead.append(pokeTitle);
    parentHead.append(pokeType);

    imagecard2.append(searchContainer);
    imagecard2.append(parentHead)

    console.log(inputText.value);
    let ability_container = document.createElement("div");
    ability_container.className = "ability_parent";
    let ul2 = document.createElement("ul");
    ul2.id = "ability_list";

    

    thisButton.addEventListener("click", function(){
        changePokemon(inputText.value,cardContainer)}
        );
    fetch('https://pokeapi.co/api/v2/pokemon/'+name)
    .then(response => response.json())
    .then(data => {
        let name = data.name;
        img2.className = "img2";

        img2.src = data.sprites.front_default;
        
        
        let capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        pokeTitle.innerText = capitalizedName;
        
        
        let types = data.types;
        imagecard2.append(img2);
        
        if(types[1] === undefined){
            typeName = capitalizeWord(types[0].type.name);
        }
        else{
            typeName = capitalizeWord(types[0].type.name) + "/ "+ capitalizeWord(types[1].type.name);
        }

        pokeType.textContent = typeName;

        let abilTitle = document.createElement("h2");
        abilTitle.textContent = "Abilities";
        imagecard2.append(abilTitle);

     
        ability_container.append(ul2);
        imagecard2.append(ability_container);

        for(d in data.abilities){
            let currAbName = data.abilities[d].ability.name;
            let url = data.abilities[d].ability.url;
            
            getAbilityDesc(url,currAbName,ul2);

        }

        let moveContainer2 = document.createElement("div");
        moveContainer2.className = "moveContainer";

        let moveTitle = document.createElement("h2");
        moveTitle.textContent = "Moves";
        imagecard2.append(moveTitle);
        imagecard2.append(moveContainer2);

        let mvSelect2 = document.createElement("select");

        moveContainer2.append(mvSelect2);

        for(m in data.moves){
            let currMoveName = data.moves[m].move.name;
            let murl = data.moves[m].move.url;
            currMoveName = currMoveName.charAt(0).toUpperCase() + currMoveName.slice(1);
            currMoveName = currMoveName.replace("-", " ");

            getMoveDesc(murl,currMoveName,moveContainer2,mvSelect2);

           

            
        }

        mvSelect2.addEventListener("change",function(){

            
            let previousCard = moveContainer2.querySelector(".moveCard");
            let selectedName = event.target.value;
            let selectedCard = moveContainer2.querySelector(`.hiddenCard[for="${selectedName}"]`);

            if(previousCard != null){
                previousCard.className = "hiddenCard";
                console.log(previousCard);
            }
            
            selectedCard.className = "moveCard";
            
            console.log(selectedName); 
            console.log(selectedCard);
    })

        cardContainer.append(imagecard2);

        
        let stCard = document.createElement("div");
        stCard.className = "statcard";
        let statUl = document.createElement("ul");
        
        
        for (let index = 0;index < 6;index++) {
            let currStat = data.stats[index];
            let currName = currStat.stat.name;
            let capStatName = currName.charAt(0).toUpperCase() + currName.slice(1);
            capStatName = capStatName.replace("-", " ");

            let statli = document.createElement("li");
            let statNameDiv = document.createElement("div");
            let statNumberDiv = document.createElement("div");

            statli.className = "statListItem";
            
            statNameDiv.className = "statName";
            statNumberDiv.className = "statNumber";
            
            statNameDiv.textContent = capStatName + ": ";
            statNumberDiv.innerHTML = currStat.base_stat;
            //statli.textContent = capStatName + ": " + currStat.base_stat;

            statli.append(statNameDiv);
            statli.append(statNumberDiv);
            let barSize = (currStat.base_stat/255) * 200;
    
            let barDiv = document.createElement("div");
           
            barDiv.style.width = barSize+"px";
            barDiv.style.height = "1rem";
            barDiv.style.backgroundColor = "green";

            statli.append(barDiv);
            statUl.append(statli);
        }
        

        stCard.append(statUl);


        let typeDivParent = document.createElement("div");
        let typeUl = document.createElement("ul");
        
        let mytypes =  types.map((type) => {
            return type.type;
        })

        console.log("Types");
        console.log(mytypes);

        cardContainer.append(stCard);



        getMultiplyier(mytypes,stCard);


        
        })

        parent.append(cardContainer);

    };



//let searchButton = document.querySelector("#searchButton");
let addButton = document.querySelector("#addButton");

//searchButton.addEventListener("click",getPokemon);
addButton.addEventListener("click",addPokemon);
