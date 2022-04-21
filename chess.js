function getIndex(arr,value){
  for(i in arr){
    if(arr[i][0]==value[0] && arr[i][1]==value[1])
      return i;
  }
}
class Chess {
    constructor() {
        console.log("Chess has been instantiated :)")
        this.coins = [["r","n","b","q","p"],["R","N","B","Q","P"]]
        this.board = [
            //       0    1    2    3    4    5    6    7
            /* a */['R', 'P', '.', '.', '.', '.', 'p', 'r'],
            /* b */['N', 'P', '.', '.', '.', '.', 'p', 'n'],
            /* c */['B', 'P', '.', '.', '.', '.', 'p', 'b'],
            /* d */['Q', 'P', '.', '.', '.', '.', 'p', 'q'],
            /* e */['K', 'P', '.', '.', '.', '.', 'p', 'k'],
            /* f */['B', 'P', '.', '.', '.', '.', 'p', 'b'],
            /* g */['N', 'P', '.', '.', '.', '.', 'p', 'n'],
            /* h */['R', 'P', '.', '.', '.', '.', 'p', 'r'],
        ]
        this.history = []
        this.currentMove = "White";
        this.castlingMove = {"e7c7":["a7","d7"],
                             "e7g7":["h7","f7"],
                             "e0g0":["h0","f0"],
                             "e0c0":["a0","d0"],
                            }
    }

    //To Check whether the move is Pawn Promotion
    isSoldierPromotion(val){
      let _ = this.getCoordinates(val);
      if(this.board[_[0]][_[1]]=='p' && val.charAt(1)=='0') return true;
      if(this.board[_[0]][_[1]]=='P' && val.charAt(1)=='7') return true;
      return false;
    }

    isUpper(val) {
        return val.charCodeAt(0) >= 65 && val.charCodeAt(0) <= 91;
    }
    isLower(val) {
        return val.charCodeAt(0) >= 97 && val.charCodeAt(0) <= 122;
    }

    //Move From chess piece from one place to another
    move(from,to){
      let ds={}
      ds['to'] = to
      ds['from'] = from
      let _ = this.getCoordinates(from);
      let fromx = _[0],fromy = _[1];
      _ = this.getCoordinates(to);
      let tox = _[0],toy = _[1];
      ds['fromVal'] = this.board[fromx][fromy];
      ds['toVal'] = this.board[tox][toy];
      this.board[tox][toy] = this.board[fromx][fromy];
      this.board[fromx][fromy] = '.';
      this.history.push(ds);
      if((ds['fromVal']=='k' || ds['fromVal']=='K') && this.castlingMove.hasOwnProperty(from+to)){
        
        
        return [this.castlingMove[from+to][0],this.castlingMove[from+to][1]];
      }
    }

    //To restore the previous move
    undo(){
      let det = this.history[this.history.length-1];
      let _ = this.getCoordinates(det['from']);
      let fromx = _[0],fromy = _[1];
      _ = this.getCoordinates(det['to']);
      let tox = _[0],toy = _[1];
      this.board[fromx][fromy] = det['fromVal'];
      this.board[tox][toy] = det['toVal'];
      this.history.pop();
      return det;
    }
  
    //Get all positions of selected chess piece
    getPosition(val){
      let i = 0,j=0;
      let ls = []
      while(i<=7){
        j=0
        while(j<=7){
          if(this.board[i][j] == val){
            ls.push(String.fromCharCode(i+97)+j.toString());
          }
          j++;
        }
        i++;
      }
      return ls;
    }

    //To check if the move is a Castling Move
    isCastling(val){
      if(val=='e0'){
        console.log(1,true);
        let ls = [];
        if(this.board[5][0]=='.' && this.board[6][0]=='.' && this.board[7][0]=='R')
          ls.push('g0');
        if(this.board[1][0]=='.' && this.board[2][0]=='.' && this.board[3][0]=='.' && this.board[0][0]=='R')
          ls.push('c0');
        console.log(ls);
        return ls;
      }
      if(val='e7'){
        let ls=[];
        if(this.board[5][7]=='.' && this.board[6][7]=='.' && this.board[7][7]=='r')
          ls.push('g7');
        if(this.board[1][7]=='.' && this.board[2][7]=='.' && this.board[3][7]=='.' && this.board[0][7]=='r')
          ls.push('c7');
        return ls;
      }
      return [];
    }

    //To check a piece inorder to avoid king Attack
    checkProtector(val,checkVal){
      let coins = this.coins[(this.isUpper(val))?0:1];
      
      for(let i=0;i<coins.length;i++){
        let pos = this.getPosition(coins[i]);
        for(let j=0;j<pos.length;j++){
          let moves = this.moves(pos[j]);
          if(moves.indexOf(checkVal)!=-1){
            this.move(pos[j],checkVal);
            if(!this.isAttacked((val=='K')?'k':'K')){ 
              this.undo();
              return true;
            }
            this.undo();
          }
        }
      }
      return false;
    }
  
    //To get the attacking opponent attacking king
    getAttacker(val,checkVal){
      let ds=[]
      let coins = this.coins[(this.isUpper(val))?0:1];
      for(let i=0;i<coins.length;i++){
        let pos = this.getPosition(coins[i]);
        for(let j=0;j<pos.length;j++){
          let moves = this.moves(pos[j]);
          if(moves.indexOf(checkVal)!=-1){
            ds.push(pos[j]);
          }
        }
      }
      return ds;
    }

    //To get all possible moves of the cuurrent state
    getPossibleMoves(val,flag=0){
      let coins = this.coins[(this.isUpper(val))?0:1];
      let ls = [];
      for(let i = 0 ;i<coins.length;i++){
        
        let pos = this.getPosition(coins[i]);
        for(let j=0;j<pos.length;j++){
          let key = pos[j].charCodeAt(0)-97;
          let place = parseInt(pos[j].charAt(1));
          
          if(this.board[key][place]=='P' && flag==1){
            if (key + 1 < 8) {
                let checkValue = this.board[key + 1][place + 1];
                if (checkValue != '.' && this.isLower(checkValue))
                    ls.push(String.fromCharCode(key + 1 + 97) + (place + 1).toString())
            }
            if (key - 1 > -1) {
                let checkValue = this.board[key - 1][place + 1];
                if (checkValue != '.' && this.isLower(checkValue))
                    ls.push(String.fromCharCode(key - 1 + 97) + (place + 1).toString())
            }
            continue;
          }
          if(this.board[key][place]=='p' && flag==1){
          if (key + 1 < 8) {
                let checkValue = this.board[key + 1][place - 1];
                if (checkValue != '.' && this.isUpper(checkValue))
                    ls.push(String.fromCharCode(key + 1 + 97) + (place - 1).toString())
            }
            if (key - 1 > -1) {
                let checkValue = this.board[key - 1][place - 1];
                if (checkValue != '.' && this.isUpper(checkValue))
                    ls.push(String.fromCharCode(key - 1 + 97) + (place - 1).toString())
            }
            continue;
          }
          
          ls.push.apply(ls,this.moves(pos[j]));
        }
      }
      console.log();
      return ls;
    }

    //To convert chess moves to (x,y) coordinates inorder to retrieve data from board matrix
    getCoordinates(val){
      return [parseInt(val.toString().charCodeAt(0)-97),parseInt(val.toString().charAt(1))];
    }
    isAttacked(king,KingPos =-999,count = 0){
        var temp,_;
        if (KingPos==-999){
          KingPos = this.getPosition(king)[0];
        }
        else{
          _ = this.getCoordinates(KingPos);
          temp = this.board[_[0]][_[1]];
          this.board[_[0]][_[1]] = king;
        }
        let OpponentMoves = this.getPossibleMoves(king,1);
        if(temp){
          this.board[_[0]][_[1]] = temp;
        }
       
       return OpponentMoves.indexOf(KingPos)!=-1;
      
    }

    //To check check Mate 
    isCheckMate(king){
      let _ = this.getCoordinates(this.getPosition(king));
      let row = _[0];
      let col = _[1];
      let check = [[row-1,col],[row-1,col+1],[row,col+1],[row+1,col+1],[row+1,col],[row+1,col-1],[row,col-1],[row-1,col-1]];
      let MovesOfKing = this.moves(this.getPosition(king)[0]);
      // Checking For Safe Place
      for(let i in MovesOfKing){
        if (!this.isAttacked(king,MovesOfKing[i],1)) return false;
        delete check[getIndex(check,this.getCoordinates(MovesOfKing[i]))];
      }
      
      let count = 0;
      let ls=[];
      for(let i in check){
        if(check[i][0]>=0 && check[i][0]<=7 && check[i][1]>=0 && check[i][1]<=7 && this.board[check[i][0]][check[i][1]]=='.'){
      
        ls.push([check[i][0],check[i][1]]);
        count++;
       }
      }
      //To check whether there are protector that can cancel check
      if(count==1){
       return !this.checkProtector((king=='K')?'k':'K',String.fromCharCode(ls[0][0]+97)+ls[0][1]); 
      }
      let attackerPos = this.getAttacker(king,this.getPosition(king)[0]);
      //To check whether there is a protector that can kill attacking piece to cancel check
      if(attackerPos.length==1){
        let moves = this.getPossibleMoves((king=='K')?'k':'K');
        return !(moves.indexOf(attackerPos[0])!=-1)
      }
     
      return true;   
    }
  
    //To get all possible moves of chess piece
    moves(position) {
        let key = position.charCodeAt(0) - 97;
        let place = parseInt(position.charAt(1));
        let ls = []
        if (this.board[key][place] == 'P') {
            if (this.board[key][place + 1] == '.' )
                ls.push(String.fromCharCode(key + 97) + (place + 1).toString())

            if (place == 1 && this.board[key][place + 2] == '.' && this.board[key][place + 1] == '.')
                ls.push(String.fromCharCode(key + 97) + (place + 2).toString())
            if (key + 1 < 8) {
                let checkValue = this.board[key + 1][place + 1];
                if (checkValue != '.' && this.isLower(checkValue))
                    ls.push(String.fromCharCode(key + 1 + 97) + (place + 1).toString())
            }
            if (key - 1 > -1) {
                let checkValue = this.board[key - 1][place + 1];
                if (checkValue != '.' && this.isLower(checkValue))
                    ls.push(String.fromCharCode(key - 1 + 97) + (place + 1).toString())
            }
            return ls
        } else if (this.board[key][place] == 'p') {
            if (this.board[key][place - 1] == '.')
                ls.push(String.fromCharCode(key + 97) + (place - 1).toString())
            if (place == 6 && this.board[key][place - 2] == '.' && this.board[key][place - 1] == '.')
                ls.push(String.fromCharCode(key + 97) + (place - 2).toString())
            if (key + 1 < 8) {
                let checkValue = this.board[key + 1][place - 1];
                if (checkValue != '.' && this.isUpper(checkValue))
                    ls.push(String.fromCharCode(key + 1 + 97) + (place - 1).toString())
            }
            if (key - 1 > -1) {
                let checkValue = this.board[key - 1][place - 1];
                if (checkValue != '.' && this.isUpper(checkValue))
                    ls.push(String.fromCharCode(key - 1 + 97) + (place - 1).toString())
            }
            return ls
        } else if (this.board[key][place] == 'R' || this.board[key][place] == 'r') {
            let flag = (this.board[key][place] == 'R') ? 1 : 0;
            ls = []
            let i = key,
                j = place + 1;
            while (j <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                j++;
            }
            i = key, j = place - 1;
            while (j >= 0) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                j--;
            }
            i = key + 1, j = place;
            while (i <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i++;
            }
            i = key - 1, j = place;
            while (i >= 0) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i--;
            }
            return ls;
        } else if (this.board[key][place] == 'B' || this.board[key][place] == 'b') {
            let flag = (this.board[key][place] == 'B') ? 1 : 0;
            ls = []
            let i = key - 1,
                j = place + 1;
            while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i -= 1;
                j += 1;
            }
            i = key - 1, j = place - 1;
            while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i -= 1;
                j -= 1;
            }
            i = key + 1, j = place - 1;
            while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i += 1;
                j -= 1;
            }
            i = key + 1, j = place + 1;
            while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i += 1;
                j += 1;
            }
            return ls;
        } else if (this.board[key][place] == 'Q' || this.board[key][place] == 'q') {
            let flag = (this.board[key][place] == 'Q') ? 1 : 0;
            ls = []
            let i = key,
                j = place + 1;
            while (j <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                j++;
            }
            i = key, j = place - 1;
            while (j >= 0) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                j--;
            }
            i = key + 1, j = place;
            while (i <= 7) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i++;
            }
            i = key - 1, j = place;
            while (i >= 0) {
                if (this.board[i][j] == '.')
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                    break;
                if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                    ls.push(String.fromCharCode(i + 97) + j.toString());
                    break;
                }
                i--;
            }
        
            i = key - 1,
            j = place + 1;
        while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
            if (this.board[i][j] == '.')
                ls.push(String.fromCharCode(i + 97) + j.toString());
            if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                break;
            if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                ls.push(String.fromCharCode(i + 97) + j.toString());
                break;
            }
            i -= 1;
            j += 1;
        }
        i = key - 1, j = place - 1;
        while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
            if (this.board[i][j] == '.')
                ls.push(String.fromCharCode(i + 97) + j.toString());
            if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                break;
            if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                ls.push(String.fromCharCode(i + 97) + j.toString());
                break;
            }
            i -= 1;
            j -= 1;
        }
        i = key + 1, j = place - 1;
        while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
            if (this.board[i][j] == '.')
                ls.push(String.fromCharCode(i + 97) + j.toString());
            if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                break;
            if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                ls.push(String.fromCharCode(i + 97) + j.toString());
                break;
            }
            i += 1;
            j -= 1;
        }
        i = key + 1, j = place + 1;
        while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
            if (this.board[i][j] == '.')
                ls.push(String.fromCharCode(i + 97) + j.toString());
            if ((flag == 1) ? this.isUpper(this.board[i][j]) : this.isLower(this.board[i][j]))
                break;
            if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) {
                ls.push(String.fromCharCode(i + 97) + j.toString());
                break;
            }
            i += 1;
            j += 1;
        }
        return ls
    }
    else if(this.board[key][place]=='N' || this.board[key][place]=='n'){
      let flag = (this.board[key][place] == 'N') ? 1 : 0;
      ls=[];
      let check=[[-1,-2],[-2,-1],[-1,2],[-2,1],[1,-2],[2,-1],[1,2],[2,1]];
      let i,j;
      for(let pos in check){
        i = key+check[pos][0]
        j = place+check[pos][1]
        if (i >= 0 && i <= 7 && j >= 0 && j <= 7){
          if (this.board[i][j] == '.')
              ls.push(String.fromCharCode(i + 97) + j.toString());
          if ((flag == 1) ? this.isLower(this.board[i][j]) : this.isUpper(this.board[i][j])) 
              ls.push(String.fromCharCode(i + 97) + j.toString());
        }
      }
      return ls;
    }
    else if(this.board[key][place]=='K' || this.board[key][place]=='k'){
      let flag = (this.board[key][place] == 'K') ? 1 : 0;
      let check = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
      let notValidPos = this.getPossibleMoves(this.board[key][place],1);
      let k,j,ls=[];
      ls.push.apply(ls,this.isCastling(position));
      for(let i in check){
        k = key+check[i][0];
        j = place+check[i][1];
        
        if (k >= 0 && k <= 7 && j >= 0 && j <= 7){
          let pos = notValidPos.indexOf(String.fromCharCode(k+97)+j.toString())==-1;
          let posAttack = this.isAttacked(this.board[key][place],String.fromCharCode(k+97)+j.toString());
          if(this.board[k][j] == '.' && pos && !posAttack){
            ls.push(String.fromCharCode(k+97)+j.toString());
          }
          else if((flag == 1) ? this.isLower(this.board[k][j]) : this.isUpper(this.board[k][j]) && notValidPos.indexOf(pos)==-1 && !posAttack){
            ls.push(String.fromCharCode(k+97)+j.toString());
          }   
        }
      
      }
      return ls;
    }
    return [];
 }
}