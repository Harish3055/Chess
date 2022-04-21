chess = new Chess();                     //Initiating Chess Class 
boardColor = ['#769440','#d4d6a5']       //Board Color
flag = true;
WhiteMove = true;                        //Board Color
prev = []                                //Has the Previously Moved Id 
color = []                               //Has the Previously Moved Id's Colour
history = {}              
var selectedId = 0;                      //Has the Previously Moved Id 
coins = [["r","n","b","q","p","k"],["R","N","B","Q","P","K"]]
coinImg ={
  'P':"./Pieces/wSoldier.png",
  'Q':"./Pieces/wQueen.png",
  'R':"./Pieces/wRook.png",
  'N':"./Pieces/wHorse.png",
  'K':"./Pieces/wKing.png",
  'B':"./Pieces/wBishop.png",
  '.':"",
  'p':"./Pieces/Soldier.png",
  'q':"./Pieces/Queen.png",
  'r':"./Pieces/Rook.png",
  'n':"./Pieces/Horse.png",
  'k':"./Pieces/King.png",
  'b':"./Pieces/Bishop.png",
}                                       //To shift Images from one place to another 

// To fill Board Colour
for(i=0;i<8;i++){
  for(j=0;j<8;j++){ document.getElementById(String.fromCharCode(j+97)+i).style.backgroundColor=boardColor[(flag)?0:1];
    flag=!flag;
  }
  flag=!flag;
}

/*
Soldier Promotion:-
------------------
Description :-  Triggered on clicking an option in Pawn Promotion Modal 
                Here Pawn changing logic is handled here
*/
function SoldierPromotion(to){
  det = chess.history[chess.history.length-1];
  _ = chess.getCoordinates(det['to']);
  chess.board[_[0]][_[1]] = to;
  document.getElementById('i'+det['to']).src =  coinImg[to];
  checkCase = !isUpper(to);
  if(chess.isAttacked((checkCase)?'K':'k')){
        if(chess.isCheckMate((checkCase)?'K':'k')){
          if(checkCase) alert('White Wins');
          else alert('Black Wins');
          location.reload();
          return;
        }
        (checkCase)?alert('♔ is attacked'):alert('♔ is attacked')
  }
  (checkCase)?$('#SoldierPromotion').modal('hide'):$('#wSoldierPromotion').modal('hide');
}

/*
Get Possible Moves:-
------------------
Description:- Get Possible icons that can move on an instance [Turn]
*/
function getAllowedPositions(index){
  AllowedPosition = []
  for(i in coins[index]){
    AllowedPosition.push.apply(AllowedPosition,chess.getPosition(coins[index][i]));
  }
  return AllowedPosition;
}

/*
Undo:-
----
Description:- Get Previously Moved coin details from chess->History 
              and restore previous positions
Note       :- Here Moves Board logic is also Handled 
*/
function undo(){
    ds = chess.undo();
    from = document.getElementById('i'+ds['from']);
    to = document.getElementById('i'+ds['to']);
    from.src = coinImg[ds['fromVal']];
    to.src = coinImg[ds['toVal']];
    WhiteMove = !WhiteMove;
    if(chess.history.length>1){
      ds = chess.history[chess.history.length-1];
      updateMovesBoard(ds['fromVal'],ds['to']);
    }
    else{
      document.getElementById('prevMov').innerHTML = '-';
    }
}

/*
Get Valid Position:-
------------------
Description:- Check for a valid move that can be taken for the selected piece
              where the piece is moved to the desired location and checked attacks 
              for king.
*/
function getValidPos(ls){
  res = []
  for(i in ls){
    chess.move(selectedId,ls[i]);
    if(!chess.isAttacked((WhiteMove)?'K':'k'))
      res.push(ls[i])
    chess.undo();
  }
  return res;
}

/*
Update Moves Board:-
------------------
Description:- To update the value present in Moves Board
*/
function updateMovesBoard(val, selectedId){
  if(val!='p' && val!='P')
        document.getElementById('prevMov').innerHTML = val.toUpperCase()+selectedId
      else
        document.getElementById('prevMov').innerHTML = selectedId
}

/*
Moves:-
-----
Description:- To Move Piece from one place to another
              where on move check, checkMate,Castling
              logic are handled here
*/
function getPos(id){
  colorArr = [];
  if(document.getElementById(id) && document.getElementById(id).style.backgroundColor=="rgb(224, 90, 72)"){
      _  = chess.getCoordinates(selectedId);
      updateMovesBoard(chess.board[_[0]][_[1]],selectedId);
      
    
      isCastling = chess.move(selectedId,id);
      console.log(isCastling)
      if(isCastling){
        let temp = document.getElementById('i'+isCastling[0]).src
        document.getElementById('i'+isCastling[1]).src = temp;
        document.getElementById('i'+isCastling[0]).src ="";
        chess.move(isCastling[0],isCastling[1]);
        
      }
      if(chess.isAttacked((WhiteMove)?'K':'k')){
        undo();
        WhiteMove = !WhiteMove;
        alert("Invalid Move King is Under Attack");
        return;
      }
      
      temp = document.getElementById('i'+selectedId).src
      document.getElementById('i'+id).src = temp;
      document.getElementById('i'+selectedId).src ="";
    
      for(i in prev){
        dots = document.getElementById(prev[i])
        dots.style.backgroundColor=color[i];
        
      }
      if(chess.isSoldierPromotion(id)){
        _ = chess.getCoordinates(id);
        
        WhiteMove = !WhiteMove;
        if(isUpper(chess.board[_[0]][_[1]]))
          $('#wSoldierPromotion').modal('toggle');
        else
          $('#SoldierPromotion').modal('toggle');
        return ;
      }
      if(chess.isAttacked((WhiteMove)?'k':'K')){
        if(chess.isCheckMate((WhiteMove)?'k':'K')){
          if(WhiteMove) alert('White Wins');
          else alert('Black Wins');
          location.reload();
          return;
        }
        (WhiteMove)?alert('♔ is attacked'):alert('♔ is attacked')
      }
      WhiteMove = !WhiteMove;
      return;
  }
  if(getAllowedPositions((WhiteMove)?1:0).indexOf(id)!=-1){
    selectedId = id;
    ls = getValidPos(chess.moves(id));
    for(i in prev){
      if(prev[i]){
        dots = document.getElementById(prev[i])
        dots.style.backgroundColor=color[i];
      }
    }
    for(i in ls){
      dots =  document.getElementById(ls[i])
      colorArr.push(dots.style.backgroundColor);
      dots.style.backgroundColor="#e05a48";
      document.getElementById(ls[i]).setAttribute("ondrop","onDrop(this.id)")
document.getElementById(ls[i]).setAttribute("ondragover","onDragOver(event)")
    }
  color = colorArr;
  prev = ls;
  }
  else{
    console.log("Invalid Move");
  }
}

// Undo Function :- triggered on key press CTRL + Z
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'z') {
    undo();
  }
});

// To Check the whether given char is Upper or Lower Case
function isUpper(val) {
  return val.charCodeAt(0) >= 65 && val.charCodeAt(0) <= 91;
}

//On Drop the Piece will be placed on the dropped spot
function onDrop(id){
  getPos(id);
}
//On Drag getPos function will be called to get Piece Possible Moves
function onDragStart(id) {
  selectedId = id.slice(1);
  getPos(id.slice(1));
}
function onDragOver(event) {
  event.preventDefault();
}
