
 const adminAuth = (req, res, next)=>{

     const token = "xyz"
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(403).send("Unauthorized")
    }
    else{
        next()
    }

}

module.exports = { adminAuth}