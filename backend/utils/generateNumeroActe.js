const generateNumeroActe = () =>{
    // Le timestamp rend le numero pratique a generer sans requete prealable.
    const annee = new Date().getFullYear();
    const numero = Date.now();
    return `ACT-${annee}-${numero}`
};

module.exports = generateNumeroActe;