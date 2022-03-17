'use strict';
// const app = document.querySelector('.app');
// const definition = document.querySelector('.definition');
// const searchDefinition = document.querySelector('.searchDefinition');
// const searchedWord = document.getElementById('searchedWord');

// let html;
// let synonym_antonym;

// const getDefinition = function(word){
//     const request = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
//     console.log(request);
//     request.then((response)=>{ 
//         console.log(response);        
//         return response.json()}).then(([data])=> {
//             renderHeading(data.word);
//             renderDefinition(data.meanings);
//             renderSynonyms(data.meanings);
//             renderAntonym(data.meanings);
//         });
// };

// const renderHeading = function(heading){
//     app.innerHTML = '';
//     html = `<div class="heading">${heading}</div><br>`;
//     app.insertAdjacentHTML('beforeend',html);
// }

// const renderDefinition = function(meanings){
//     html = `<h1>Definition : </h1>`;
//     app.insertAdjacentHTML('beforeend', html);
//     meanings.forEach(function(meaning,i){
//         const [info] = meaning.definitions;
//         // console.log(info.definition);
//         html = `<div class="definition">${i+1}) ${info.definition}</div>`
//         app.insertAdjacentHTML('beforeend', html);
//     });
// }

// const renderSynonyms = function(meanings){
//     html = `<h1>Synonyms : </h1>`;
//     app.insertAdjacentHTML('beforeend', html);
//     meanings.forEach(function(meaning,i){
//         const [info] = meaning.definitions;
//         if(!info.synonyms.length) return;
//         console.log(info.synonyms);
//         console.log(info.synonyms.length);
//         synonym_antonym = '';
//         info.synonyms.forEach((synonym)=>{
//             synonym_antonym += `${synonym}; `;
//         });
//         html = `<div class="synonym">${synonym_antonym}</div>`;
//         app.insertAdjacentHTML('beforeend', html);
//     });    

// };

// const renderAntonym = function(meanings){
//     html = `<h1>Antonym : </h1>`;
//     app.insertAdjacentHTML('beforeend', html);
//     meanings.forEach(function(meaning,i){
//         const [info] = meaning.definitions;
//         if(!info.antonyms.length) return;
//         console.log(info.antonyms);
//         console.log(info.antonyms.length);
//         synonym_antonym = '';
//         info.antonyms.forEach((antonym)=>{
//             synonym_antonym += `${antonym}; `;
//         });
//         html = `<div class="antonym">${synonym_antonym}</div>`;
//         app.insertAdjacentHTML('beforeend', html);
//     });    

// };







// searchDefinition.addEventListener('click', function(e){
//     getDefinition(searchedWord.value);
// });


const searchDefinition = document.querySelector('.searchDefinition');
const searchedWord = document.getElementById('searchedWord');
const heading = document.querySelector('.heading');
const definition = document.querySelector('.definition');
const synonym = document.querySelector('.synonym');
const antonym = document.querySelector('.antonym');
const errorDisplay = document.querySelector('.errorDisplay');
const playAudio = document.querySelector('.playAudio');
const myAudio = document.getElementById('myAudio');

let definitionContent = `<h1>Definition :</h1>`;
let synonymContent = `<h1>Synonym : </h1>`;
let antonymContent = `<h1>Antonym : </h1>`;
let errorContent = ``;
let audio;
let checkA = [];
let checkS = [];


const hideContent = function(){
    synonym.classList.add('hide');
    antonym.classList.add('hide');
    definition.classList.add('hide');
    heading.classList.add('hide');
    errorDisplay.classList.add('hide');

};

const dataInit = function(){
    checkA = [];
    checkS = [];
    definitionContent = `<h1>Definition :</h1>`;
    synonymContent = `<h1>Synonym : </h1>`;
    antonymContent = `<h1>Antonym : </h1>`;
    errorContent = ``;
    errorDisplay.innerHTML = '';
    heading.innerHTML = '';
    definition.innerHTML = '';
    synonym.innerHTML = '';
    antonym.innerHTML = '';
    playAudio.src = '';
};

hideContent();

searchDefinition.addEventListener('click', function(e){
    if(!searchedWord.value){
        hideContent();
        renderError(`Oops!! Please search for a Word :D`);
        
    }
    else{
        dataInit();
        hideContent();
        getDefinition(searchedWord.value);
    }
    
});

const renderError = function(message){
    errorContent = `${message}`;
    errorDisplay.innerHTML = `${errorContent}`;
    errorDisplay.classList.remove('hide');
    errorDisplay.classList.add('myapp');
}

const getDefinition = function(word){
    const request = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    request.then((req)=>{
                        
                        if(!req.ok) throw new Error(`Word not Found ${req.status}`);
                        return req.json();})
                .then(([response])=>{
                    console.log(response);
                    audio = `${[[response.phonetics][0]][0][0].audio}`;
                    playAudio.src = `https:${audio}`;
                    console.log(audio);
                    renderHTML(response);})
                .catch( (err)=> {console.error(`${err}`);
                    renderError(`${err.message}`);});
        

};

const renderHTML = function(data){
    heading.innerHTML = `${data.word} <img src="speaker.png" class="speaker" onClick="speaker()">`;
    heading.classList.remove('hide');

    data.meanings.forEach(function(meaning){
        const [info] = meaning.definitions;
        definitionContent += `<li> ${info.definition}</li>`;
        renderAntonym(info);
        renderSynonym(info);
    });

    checkAntonym(checkA);
    checkSynonym(checkS);
    

    definition.innerHTML = `${definitionContent}`;
    definition.classList.remove('hide');

    synonym.innerHTML = `${synonymContent}`;
    synonym.classList.remove('hide');

    
    antonym.innerHTML = `${antonymContent}`;
    antonym.classList.remove('hide');
    // console.log(definitionContent);
};

const checkAntonym = function(check){
    if(!check.length){
        antonymContent += `No Antonym Found`;
    }
    else{
        check.forEach((c)=>{
            antonymContent += `${c}; `;
        });
    }
};

const checkSynonym = function(check){
    if(!check.length){
        synonymContent += `No Synonym Found`;
    }
    else{
        check.forEach((c)=>{
            synonymContent += `${c}; `;
        });
    }
};

const renderAntonym = function(info){
    if(!info.antonyms.length) return;
    info.antonyms.forEach((antonym)=>{
        checkA.push(antonym);
        });
};

const renderSynonym = function(info){
    if(!info.synonyms.length) return;
    info.synonyms.forEach((synonym)=>{
        checkS.push(synonym);
        });

};

const  speaker = function(){
    myAudio.play();
    console.log("clicked");
    // console.log(playAudio.src);
    // fetch(playAudio.src).then((response)=> console.log(response));
};



