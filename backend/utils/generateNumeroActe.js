const generateNumeroActe = () =>{
    const annee = new Date().getFullYear();
    const numero = Date.now();
    return `ACT-${annee}-${numero}`
};

module.exports = generateNumeroActe;