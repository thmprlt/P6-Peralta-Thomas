const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes:0,
      dislikes:0
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?

    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            if(!sauce){
                return res.status(404).json({error: new Error('Sauce non trouvée')});
            }
            if(sauce.userId !== req.auth.userId){
                return res.status(401).json({error: 'Requête non autorisée'});
            }
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce supprimée'}))
            .catch(error => res.status(400).json({error}));
        }
    );
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
  }

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
        console.log(error)
        res.status(400).json({error})});
  }

exports.likeSauce = (req, res, next) => {

    Sauce.findOne(
        {_id: req.params.id}
    )
    .then((sauce) => { 

    if(req.body.like == 1){
        //ici il faut verifier si l'utilisateur n'est pas deja le tableau 
      
        if(sauce.usersLiked.indexOf(req.body.userId)== -1){
        sauce.likes +=  1;
        sauce.usersLiked.push(req.body.userId);
        }

      
       
        // Sauce.updateOne({_id: req.params.id},{   ...sauce, _id:req.params.id  })
        // .then(sauce => res.status(200).json(sauce))
        // .catch(error => res.status(400).json({error}));
    }

    if(req.body.like == 0) {
       
            if(sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(400).json({error}));
            }
            if(sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
                .then(sauce => res.status(200).json(sauce))
                .catch(error => res.status(400).json({error}));
            }
        
    }

    if(req.body.like == -1){

        if(sauce.usersDisliked.indexOf(req.body.userId)== -1){
            sauce.dislikes +=  1;
            sauce.usersDisliked.push(req.body.userId);
            }
    }
    sauce.save().then(()=>{
        res.status(200).json(sauce)
    })

    })
}