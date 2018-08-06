//旋转矩阵
var rotateLeft = function(matrix){
    var rows = matrix.length;
    var columns = matrix[0].length;
    var res = [];
    for(var row = 0;row<rows;row++){
        res.push([]);
        for(var column = 0;column<columns;column++){
            res[row][column] = matrix[column][columns-row-1];
        }
    }
    return res;
}

class Tile{
    constructor(value,row,column){
        this.value = value||0;
        this.row = row||-1;
        this.column = column||-1;
        this.oldRow = -1;
        this.oldColumn = -1;
        this.mergedInto = null;
        this.id = Tile.id++;
    }
    moveTo(row,column){//移动到函数
        this.oldRow = this.row;
        this.oldColumn = this.column;
        this.row = row;
        this.column = column;
    }
    isNew(){
        return this.oldRow == -1 && !this.mergedInto;
    }
    hasMoved(){//判断移动
        return (this.fromRow() != -1 && (this.fromRow() != this.toRow() || this.fromColumn() != this.toColumn())) || this.mergedInto;
    }
    fromRow(){
        return this.mergedInto ? this.row:this.oldRow;
    }
    fromColumn() {
        return this.mergedInto ? this.column : this.oldColumn;
    }
    toRow() {
        return this.mergedInto ? this.mergedInto.row : this.row;
    }
    toColumn(){
        return this.mergedInto ? this.mergedInto.column : this.column;
    }
    static id = 0;
}

class Box{
    constructor(){
        this.tiles = [];
        this.cells = [];
        for(var i = 0;i<Box.size;i++){
            this.cells[i] = [this.addTile(),this.addTile(), this.addTile(), this.addTile()];
        }
        this.addRandomTile();
        this.setPositions();
        this.won = false;
    }
    addTile(...arg){//添加单元块
        var res = new Tile;
        Tile.apply(res,arg);
        this.tiles.push(res);
        return res;
    }
    moveLeft(){//向左移动的处理
        console.log(11)
        var hasChanged = false;
        for (var row = 0; row < Box.size; row++) {
            console.log(1)
            var currentRow = this.cells[row].filter(tile => tile.value != 0);
            var resultRow = [];
            for (var target = 0; target < Box.size; target++) {
                var targetTile = currentRow.length ? currentRow.shift() : this.addTile();
                if (currentRow.length > 0 && currentRow[0].value == targetTile.value) {//相等合并
                    var tile1 = targetTile;
                    targetTile = this.addTile(targetTile.value);
                    tile1.mergedInto = targetTile;
                    var tile2 = currentRow.shift();
                    tile2.mergedInto = targetTile;
                    targetTile.value += tile2.value;
                }
                resultRow[target] = targetTile;
                this.won |= (targetTile.value == 2048);
                hasChanged |= (targetTile.value != this.cells[row][target].value);
            }
            this.cells[row] = resultRow;
        }
        return hasChanged;
    }
    setPositions(){//重置定位
        this.cells.forEach((row,rowIndex) => {
            row.forEach((tile,columnIndex) => {
                tile.oldRow = tile.row;
                tile.oldColumn = tile.column;
                tile.row = rowIndex;
                tile.column = columnIndex;
                tile.markForDeletion = false;
            })
        })
    }
    addRandomTile(){//随机生成单元块
        var emptyCells = [];
        for(var r = 0;r<Box.size;r++){
            for(var c = 0;c<Box.size;c++){
                if(this.cells[r][c].value == 0){
                    emptyCells.push({r:r,c:c});
                }
            }
        }
        var index = Math.floor(Math.random()*emptyCells.length)
        var cell = emptyCells[index];
        var newValue = Math.random()<Box.fourProbability?4:2;
        this.cells[cell.r][cell.c] = this.addTile(newValue);
    }
    clearOldTiles(){//清除delete标签
        this.tiles = this.tiles.filter(tile => tile.markForDeletion == false);
        this.tiles.forEach(tile => { tile.markForDeletion = true;});
    }
    move(direction){//事件触发移动函数
        this.clearOldTiles();
        for (var i = 0; i < direction; i++) {
            this.cells = rotateLeft(this.cells);
        }
        var hasChanged = this.moveLeft();
        for (var i = direction; i < 4; i++) {
            this.cells = rotateLeft(this.cells);
        }
        if (hasChanged) {
            this.addRandomTile();
        }
        this.setPositions();
        return this;
    }
    hasWon(){//获取输赢
        return this.won;
    }
    hasLost() {//获取时候可以移动
        var canMove = false;
        for (var row = 0; row < Box.size; row++) {
            for (var column = 0; column < Box.size; column++) {
                canMove |= (this.cells[row][column].value == 0);
                for (var dir = 0; dir < 4; dir++) {
                    var newRow = row + Box.deltaX[dir];
                    var newColumn = column + Box.deltaY[dir];
                    if (newRow < 0 || newRow >= Box.size || newColumn < 0 || newColumn >= Box.size) {
                        continue;
                    }
                    canMove |= (this.cells[row][column].value == this.cells[newRow][newColumn].value);
                }
            }
        }
        return !canMove;
    };
    static fourProbability = 0.25;
    static deltaX = [-1,0,1,0];
    static deltaY = [0,-1,0,1];
    static size = 4;
};

export {Box}