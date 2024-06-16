let pathToDOM = "../page/"
if(localStorage.getItem("tokenArosaje")==undefined){
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

// localStorage.setItem("tokenArosaje","value")

// localStorage.removeItem("tokenArosaje")

// effacer tout le localStorage
// localStorage.clear()