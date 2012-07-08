// this is your opponent in the real-time player to use for debugging


var toConsider = new Array();
var considered = new Array(HEIGHT);

var fruit_to_skip = {};

function new_game() {
    toConsider = new Array();
    considered = new Array(HEIGHT);

    fruit_to_skip = {};
}

function make_move() {
    // to disable to opponent, uncomment the next line
    // return PASS;

    var board = get_board();

    inspectFruit();
    var log ='skipping fruit(s): ';
    for (var f in fruit_to_skip) {
        if (fruit_to_skip[f]) {
            log += f;
        }
    }
    console.log(log);

    // we f(und an item! take it!
    if (has_item(board[get_opponent_x()][get_opponent_y()])) {
        return TAKE;
    }

    // looks like we'll have to keep track of what moves we've looked at
    toConsider = new Array();
    considered = new Array(HEIGHT);
    for (var i = 0; i < WIDTH; i++) {
        considered[i] = new Array(HEIGHT);
        for (var j = 0; j < HEIGHT; j++) {
            considered[i][j] = 0;
        }
    }

    // let's find the move that will start leading us to the closest item
    return findMove(new node(get_opponent_x(), get_opponent_y(), -1));
}

function inspectFruit() {
    for(var fruit = 1; fruit - 1 < get_number_of_item_types(); fruit += 1) {

        var my_items    = get_my_item_count(fruit);
        var opp_items   = get_opponent_item_count(fruit);
        var total_items = get_total_item_count(fruit);
        var left_items  = total_items - my_items - opp_items;

        console.log('for fruit ' + fruit);
        console.log(': my  item(s) ' + my_items);
        //        c(nsole.log(': opp item(s) ' + opp_items);
        //        console.log(': tot item(s) ' + total_items);

        // amount remaining_fruit_needed_to_win
        var needed_to_win = (total_items / 2);
        var my_additional_fruit_needed = needed_to_win - my_items;
        var opp_additional_fruit_needed = needed_to_win - opp_items;

        var my_fruit_score = my_additional_fruit_needed;
        var opp_fruit_score = opp_additional_fruit_needed;

        console.log('my  score is '+my_fruit_score);
        console.log('opp score is '+opp_fruit_score);


        if (my_items >= needed_to_win || opp_items >= needed_to_win) {
            fruit_to_skip[fruit] = 1;
        }
    }
}

function findMove(n) {
    var board = get_board();

    // closest item! we will go to it
    if (has_item(board[n.x][n.y]))
        return n.move;

    var possibleMove = n.move;

    // NORTH
    if (considerMove(n.x, n.y-1)) {
        if (n.move == -1) {
            possibleMove = NORTH;
        }
        toConsider.push(new node(n.x, n.y-1, possibleMove));
    }

    // SOUTH
    if (considerMove(n.x, n.y+1)) {
        if (n.move == -1) {
            possibleMove = SOUTH;
        }
        toConsider.push(new node(n.x, n.y+1, possibleMove));
    }

    // WEST
    if (considerMove(n.x-1, n.y)) {
        if (n.move == -1) {
            possibleMove = WEST;
        }
        toConsider.push(new node(n.x-1, n.y, possibleMove));
    }

    // EAST
    if (considerMove(n.x+1, n.y)) {
        if (n.move == -1) {
            possibleMove = EAST;
        }
        toConsider.push(new node(n.x+1, n.y, possibleMove));
    }

    // take next node to bloom out from
    if (toConsider.length > 0) {
        var next = toConsider.shift();
        return findMove(next);
    }

    // no move found
    return -1;
}

function considerMove(x, y) {
    var board = get_board();

    if (!isValidMove(x, y)) return false;
    if (considered[x][y] > 0) return false;
    if (fruit_to_skip[board[x,y]]) return false;

    considered[x][y] = 1;
    return true;
}

function isValidMove(x, y) {
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
        return false;
    return true;
}

function node(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
}
