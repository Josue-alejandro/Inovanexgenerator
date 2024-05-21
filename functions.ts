// program to generate random strings

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateString = (length) => {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

const currentDate = () => {
    return new Date().toISOString().slice(0, 19).replace(/,/, '-') + ' ' + new Date().toLocaleString();
  };

const findAdmin = (userArray, mail, password) => {
    for (let i = 0; i < userArray.length; i++) {
        if (userArray[i].mail === mail && userArray[i].password === password) {
            return userArray[i];
        }
    }
    
    return null;
}

module.exports = { generateString, currentDate, findAdmin }