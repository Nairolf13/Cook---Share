const listeRecette = document.getElementById("containerRecette")
const usersContainer = document.getElementById("containerUsers")
const error = document.querySelector('#err')
const formSection = document.getElementById("formRecette");
const listRecette = document.getElementById("recetteContainer");
const listUsers = document.getElementById("usersContainer")
const presentation = document.getElementById("presentation")
const inscription = document.getElementById("formInscription")
const btnConnexion = document.getElementById("btn-connexion")
const btnDeconnexion = document.getElementById("btn-deconnexion")
const btninscription = document.getElementById("btn-inscription")
const btnSeeRecette = document.getElementById("btn-seeRecette")
const btnRecette = document.getElementById("btn-recette")
const btnUsers = document.getElementById('btn-users')
const btnAddRecette = document.getElementById("btn-addRecette")
const formConnexion = document.getElementById("formConnexion")
const token = localStorage.getItem('token')
const research = document.getElementById("barreRecherche")
const btnSaveInscription = document.getElementById('btn-save')
const formUpdate = document.getElementById("updateForm")
let isReady = false
let isReadyForm = false

btnDeconnexion.addEventListener("click", function () {
    localStorage.removeItem('token')
    window.location.reload();
});

btnAddRecette.addEventListener("click", function () {
    moveTo(formSection)
});

btnRecette.addEventListener("click", async function () {
    const response = await fetch("http://127.0.0.1:3001/me/recettes", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })

    const data = await response.json()
    listeRecette.innerHTML = "";
    createRecipesContainer(data)
    moveTo(listRecette)
    if (research) research.classList.remove("hidden")
});

function displayAdminButton(){
    
        const removes =document.getElementsByClassName("removeRecette")
        const shares =document.getElementsByClassName("shared")
        const updates = document.getElementsByClassName("updateBtn")

        if (sessionStorage.getItem("role") == "user"){
            for(let remove of removes){remove.classList.add("hidden")}
            for(let share of shares){share.classList.add("hidden")}
            for(let update of updates){update.classList.add("hidden")}
        }
        if (research) research.classList.remove("hidden")
}

btninscription.addEventListener("click", function () {

    moveTo(inscription)
})

btnConnexion.addEventListener("click", function () {

    moveTo(formConnexion)
})

btnUsers.addEventListener("click", function () {
    moveTo(listUsers)
})

btnSeeRecette.addEventListener("click", function (){

    moveTo(listRecette)
})


research.addEventListener('input', () => {

    const queryString = "?" + document.querySelector('#barreRecherche').name + "=" + document.querySelector('#barreRecherche').value;
    displayRecette(queryString);
});

if (document.getElementById("updateForm")) {
    document.getElementById("updateForm").remove()
}

function enabledFonctionality() {
    if (!token) {
        if (btnUsers) btnUsers.classList.add('hidden')
        if (btnRecette) btnRecette.classList.add('hidden');
        if (btnDeconnexion) btnDeconnexion.classList.add('hidden');
        if (btnAddRecette) btnAddRecette.classList.add('hidden');
        if (btnSeeRecette) btnSeeRecette.classList.add('hidden');
        if (formConnexion) formConnexion.classList.add('hidden')
    } else {
        if (sessionStorage.getItem("role") == "admin") {
            btnUsers.classList.remove('hidden')
        }
        if (btnRecette) btnRecette.classList.remove('hidden');
        if (btnDeconnexion) btnDeconnexion.classList.remove('hidden');
        if (btnAddRecette) btnAddRecette.classList.remove('hidden');
        if (btnSeeRecette) btnSeeRecette.classList.remove('hidden');
        if (btnConnexion) btnConnexion.classList.add('hidden');
        if (btninscription) btninscription.classList.add('hidden');
    }
}

function moveTo(element) {
    document.querySelectorAll('.section').forEach((el) => {
        if (!el.classList.contains('hidden')) {
            el.classList.add('hidden')
        }
        element.classList.remove("hidden");
    })
}

function addUser() {
    let error = document.getElementById("error");
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

    if (username.length < 3) {
        error.textContent = "Le nom d'utilisateur doit contenir au moins 3 caractères.";
        return;
    }

    if (!emailRegex.test(email)) {
        error.textContent = "L'adresse email n'est pas valide.";
        return;
    }

    if (!passwordRegex.test(password)) {
        error.textContent = "Le mot de passe doit contenir au moins une majuscule, un chiffre, un caractère spécial, et 12 caractères.";
        return;
    }

    if (password !== confirmPassword) {
        error.textContent = "Les mots de passe ne correspondent pas.";
        return;
    }

    let user = {
        username: username,
        email: email,
        password: password
    }

    fetch('http://localhost:3001/user', {
        method: 'POST',
        headers: {
            "Content-type": "Application/json"
        },
        body: JSON.stringify(user)
    }).then((response) => {
        response.json().then((data) => {
            if (!response.ok) {
                error.textContent = "Erreur lors de l'inscription. Veuillez réessayer.";
            } else {
                error.textContent = "Inscription réussie !"
                moveTo(formConnexion);
            }
        });
    }).catch((error) => {
        console.error("Erreur lors de l'inscription :", error);
    });
}


function getRole() {
    fetch('http://localhost:3001/me', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
    })
        .then((response) => response.json())
        .then((data) => {

            if (!data.success) {
                document.getElementById("err").innerHTML = "Aucune donnée disponible!";
            } else {
                document.getElementById("err").innerHTML = "";
                if (data.user) {
                    sessionStorage.setItem("role", data.user.role)
                }
            }
        })
}

function isShared() {
    fetch('http://localhost:3001/recette', {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
    })
        .then((response) => response.json())
        .then((data) => {

            if (!data.success || !data.recettes) {
                document.getElementById("err").innerHTML = "Aucune donnée disponible!";
            } else {
                document.getElementById("err").innerHTML = "";
                let sharedFound = false;
                
                data.recettes.forEach(recette => {
                    if (recette.isShared == true) {
                        sharedFound = true;
                    }
                });
                sessionStorage.setItem("shared", sharedFound);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des recettes :", error);
        });
}

function connexionUser() {
    let user = {
        username: document.getElementById("co-username").value,
        password: document.getElementById("co-password").value
    }
    fetch('http://localhost:3001/user/login', {
        method: 'POST',
        headers: {

            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                document.getElementById("err").innerHTML = "La saisie n'est pas valide !";
            } else {
                document.getElementById("err").innerHTML = "";
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    getRole()
                    isShared()
                    enabledFonctionality()
                    window.location.href = "/index.html";
                }
            }
        })
        .catch((error) => {
            console.error("Erreur:", error);
            document.getElementById("err").innerHTML = "Une erreur est survenue !";
        });
}

function displayRecette(queryString = "") {
    fetch('http://localhost:3001/recette' + queryString, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
    }).then((response) => {
        response.json().then((data) => {
            if (!response.ok) {
                listeRecette.innerHTML = "Il n'y a aucune recette"
                return
            }
            listeRecette.innerHTML = "";
            createRecipesContainer(data)
            displayAdminButton()
            if(localStorage.getItem("role") != "admin") {
            }
        });
    })
}

function displayUsers() {
    fetch('http://localhost:3001/me/users/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
    }).then((response) => {
        response.json().then((data) => {


            if (!response.ok) {
                usersContainer.innerHTML = "Il n'y a aucune recette"
                return
            }
            usersContainer.innerHTML = "";
            createUsersTable(data.users)
        });
    })
}

function createUsersTable(users) {

    let afficherUtilisateurs = document.getElementById("containerUsers");
    let table = document.createElement("table");
    table.classList.add("usersTable");

    let tableHead = document.createElement("thead");
    let headerRow = document.createElement("tr");
    let headers = ["Nom d'utilisateur", "Email", "Rôle", "Actions"];
    headers.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);

    let tableBody = document.createElement("tbody");

    users.forEach(user => {

        let row = document.createElement("tr");
        let containerForm = document.getElementById('containerForm')

        let usernameCell = document.createElement("td");
        usernameCell.textContent = user.username;
        row.appendChild(usernameCell);

        let emailCell = document.createElement("td");
        emailCell.textContent = user.email;
        row.appendChild(emailCell);

        let roleCell = document.createElement("td");
        roleCell.id = "role"
        roleCell.textContent = user.role;
        row.appendChild(roleCell);

        let actionsCell = document.createElement("td");

        let supBtn = document.createElement("button");
        supBtn.innerHTML = "🗑";
        supBtn.addEventListener('click', () => {
            deleteUser(user._id);
        });
        actionsCell.appendChild(supBtn);

        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Modifier";
        actionsCell.appendChild(editBtn);

        editBtn.addEventListener('click', () => {
            if (!isReady) {
                isReady = true


                let updateForme = document.createElement("form");
                updateForme.id = "updateForm";
                updateForme.innerHTML = `
                <h3>Modifier l'utilisateur</h3>
                <label for="updateUsername">Nom d'utilisateur :</label>
                <input type="text" id="updateUsername" value="${user.username}" />
                
                <label for="updateEmail">Email :</label>
                <input type="email" id="updateEmail" value="${user.email}" />
                
                <label for="updateRole">Rôle :</label>
                <input type="text" id="updateRole" value="${user.role}" />
                
                <button type="button" id="saveUpdate">Mettre à jour</button>
                <button type="button" id="closeUpdateForm">Fermer</button>`;

                containerForm.appendChild(updateForme);

                document.getElementById("saveUpdate").addEventListener('click', () => {
                    updateUser(user._id);
                    updateForme.remove();
                    isReady = false;
                });
                document.getElementById("closeUpdateForm").addEventListener('click',()=>{
                    updateForme.remove()
                    isReady=false
                })
            }
        });

        row.appendChild(actionsCell);
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    afficherUtilisateurs.appendChild(table);
}

function createRecipesContainer(data) {
    data.forEach(recettes => {

        let afficherRecette = document.getElementById("containerRecette");
        let recette = document.createElement("div");

        recette.classList.add("recette");
        afficherRecette.appendChild(recette);

        let titre = document.createElement("p");
        titre.id = "titreRecette";
        recette.appendChild(titre);
        titre.innerHTML = recettes.title;

        if (recettes.imageRecette) {
            let pics = document.createElement("div");
            const imgel = document.createElement('img');
            imgel.src = "http://localhost:3001/" + recettes.imageRecette;
            pics.appendChild(imgel);

            pics.id = "pics";
            recette.append(pics);
        }

        let ingredient = document.createElement("p");
        ingredient.id = "ingredientRecette";
        recette.appendChild(ingredient);
        ingredient.innerHTML = recettes.ingredient;

        let instruction = document.createElement("p");
        instruction.id = "instructionPrepa";
        recette.appendChild(instruction);
        instruction.innerHTML = recettes.instructionPreparation;

        let tempsPrepa = document.createElement("p");
        tempsPrepa.id = "timePrepa";
        recette.appendChild(tempsPrepa);
        tempsPrepa.innerHTML = recettes.tempsPreparation;

        let tempsCuisson = document.createElement("p");
        tempsCuisson.id = "timeCuisson";
        recette.appendChild(tempsCuisson);
        tempsCuisson.innerHTML = recettes.tempsCuisson;

        let difficult = document.createElement("p");
        difficult.id = "difficulte";
        recette.appendChild(difficult);
        difficult.innerHTML = recettes.difficulte;

        let category = document.createElement("p");
        category.id = "category";
        recette.appendChild(category);
        category.innerHTML = recettes.categorie;

            let sup = document.createElement("button");
            sup.classList.add("removeRecette");
            recette.appendChild(sup);
            sup.innerHTML = "🗑";
            sup.style.marginRight = "10px"; 
            sup.style.backgroundColor = "red";
            sup.addEventListener('click', () => {
                deleteRecette(recettes._id);
            });

            let shared = document.createElement("button");
            shared.classList.add("shared");
            recette.appendChild(shared);
            shared.innerHTML = "🔃";
            shared.addEventListener('click', () => {
                share(recettes._id);
            });

            let update = document.createElement("button");
            update.classList.add("updateBtn");
            recette.appendChild(update);
            update.innerHTML = "Modifier";

            update.addEventListener('click', () => {

                if (!isReadyForm) {
                    isReadyForm = true;

                    let updateForm = document.createElement("form");
                    updateForm.id = "updateForm";
                    updateForm.innerHTML = `
                            <h3>Modifier la recette</h3>
                            <label for="updateTitle">Titre :</label>
                            <input type="text" id="updateTitle" value="${recettes.title}" />
                            
                            <label for="updateIngredient">Ingrédients :</label>
                            <input type="text" id="updateIngredient" value="${recettes.ingredient}" />
                            
                            <label for="updateInstruction">Instructions :</label>
                            <input type="text" id="updateInstruction" value="${recettes.instructionPreparation}" />
                            
                            <label for="updateTimePrepa">Temps de préparation :</label>
                            <input type="number" id="updateTimePrepa" value="${recettes.tempsPreparation}" />
                            
                            <label for="updateTimeCuisson">Temps de cuisson :</label>
                            <input type="number" id="updateTimeCuisson" value="${recettes.tempsCuisson}" />
                            
                            <label for="updateDifficulte">Difficulté :</label>
                            <input type="text" id="updateDifficulte" value="${recettes.difficulte}" />
                            
                            <label for="updateCategorie">Catégorie :</label>
                            <input type="text" id="updateCategorie" value="${recettes.categorie}" />
                            
                            <label for="updatePicture">Image :</label>
                            <input type="file" id="updatePicture" />
                            
                            <button type="button" id="saveUpdate">Mettre à jour</button>
                            <button type="button" id="closeUpdate">Fermer</button>`;

                    recette.appendChild(updateForm);

                    document.getElementById("saveUpdate").addEventListener('click', () => {
                        updateRecette(recettes._id);
                        updateForm.remove();
                        isReadyForm = false;
                    });

                    document.getElementById("closeUpdate").addEventListener('click', () => {
                        updateForm.remove();
                        isReadyForm = false;
                    });
                }
            });
    });
}

displayRecette()

function addRecette() {
    const formData = new FormData()
    const imageFile = document.getElementById("picture").files[0];

    formData.append('title', document.getElementById("title").value,)
    formData.append('ingredient', document.getElementById("ingredient").value,)
    formData.append('instructionPreparation', document.getElementById("instruction").value,)
    formData.append('tempsPreparation', document.getElementById("timePreparation").value,)
    formData.append('tempsCuisson', document.getElementById("timeCuisson").value,)
    formData.append('difficulte', document.getElementById("difficulte").value,)
    formData.append('categorie', document.getElementById("categorie").value,)
    formData.append('picture', imageFile);

    fetch('http://localhost:3001/recette', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: formData
    })
        .then((response) => {
            response.json()
                .then((data) => {
                    displayRecette()
                    moveTo(listRecette)
                    if (!response.ok) {
                        error.innerHTML = "La saisie n'est pas valide !"
                    } else {
                        error.innerHTML = ""
                    }
                })
        })
}

function updateRecette(recetteId) {
    let recette = {
        title: document.getElementById("updateTitle").value,
        ingredient: document.getElementById("updateIngredient").value,
        instructionPreparation: document.getElementById("updateInstruction").value,
        tempsPreparation: document.getElementById("updateTimePrepa").value,
        tempsCuisson: document.getElementById("updateTimeCuisson").value,
        difficulte: document.getElementById("updateDifficulte").value,
        categorie: document.getElementById("updateCategorie").value,
        imageRecette: document.getElementById("updatePicture").value,
    }

    fetch('http://localhost:3001/recette/' + recetteId, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            "Content-type": "Application/json"
        },
        body: JSON.stringify(recette)
    }).then((response) => {
        response.json().then((data) => {
            displayRecette()
        })
    })
}

function updateUser(userId) {
    let user = {
        username: document.getElementById("updateUsername").value,
        email: document.getElementById("updateEmail").value,
        role: document.getElementById("updateRole").value
    }
    fetch('http://localhost:3001/user/' + userId, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            "Content-type": "Application/json"
        },
        body: JSON.stringify(user)
    }).then((response) => {
        response.json().then((user) => {
            displayUsers()
        })
    })
}

async function share(recetteId) {
    let share = await fetch('http://localhost:3001/shareRecipe/' + recetteId, {
        method: "PATCH",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    let shared = await share.json();
    listeRecette.innerHTML = "";
    displayRecette();
}

async function deleteUser(userId) {
    let supression = await fetch('http://localhost:3001/user/' + userId, {
        method: 'DElETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    let data = await supression.json()
    displayUsers()
}

async function deleteRecette(recetteId) {
    let supression = await fetch('http://localhost:3001/recette/' + recetteId, {
        method: "DELETE",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    let data = await supression.json()
    displayRecette()
}

enabledFonctionality()
