//*******************************************Canvas Questions*****************************************
var mongoose = require( 'mongoose' );
var People     = mongoose.model( 'People' );
var Campaign = mongoose.model( 'Campaign' );


exports.indexcanvas = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

var campaign2 = "";
    Campaign.
      find({ user_id : user_id }).
      sort( '-updated_at' ).
      exec( function ( err, campaign){
        if( err ) return next( err );

        campaign2 = campaign;
      })
      .then( function (err, data) {

        People.
          find({ user_id : user_id }).
          sort( '-updated_at' ).
          exec( function ( err, peopleList){
            if( err ) return next( err );

            res.render( 'canvasQuestion', {
                peopleList : peopleList,
                campaign: campaign2
            });
          });
      }
      )


};

exports.editcanvas = function( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  People.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, peopleList ){
      if( err ) return next( err );

      res.render( 'editpeople', {
        peopleList : peopleList,
        current : req.params.id
      });
    });
};

exports.updatecanvas = function( req, res, next ){
  People.findById( req.params.id, function ( err, peopleList ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if( peopleList.user_id !== user_id ){
      return utils.forbidden( res );
    }
    firstName.firstName    = req.body.firstName;
    lastName.firstName    = req.body.lastName;
    peopleList.save( function ( err, firstName, firstName ){
      if( err ) return next( err );

      res.redirect( 'canvasQuestion' );
    });
  });
};

exports.current_user = function ( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }

  next();
};
