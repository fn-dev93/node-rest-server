import jwt from 'jsonwebtoken';

const generateJWT = ( uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h',
        },  (err, token) =>{
            if (err){
                console.log(err);
                reject("Could'nt create JWT");
            } else {
                resolve(token);
            }
        });

    })
}

export default generateJWT;