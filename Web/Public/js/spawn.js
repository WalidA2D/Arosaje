let pathToDOM = "../page/"
if(localStorage.getItem("ArosajeToken")==undefined){
    pathToDOM += "connexion.html"
} else {
    pathToDOM += "accueil.html"
}
fetch(pathToDOM)
.then(response=>{
    return response.text()
})
.then(data=>{
    document.querySelector('body').innerHTML = data
})

// localStorage.setItem("ArosajeToken","value")

// localStorage.removeItem("ArosajeToken")

// effacer tout le localStorage
localStorage.clear()

function setUserData(){
    document.querySelector('.firstName') = localStorage.getItem("ArosajeFirstName")
}
