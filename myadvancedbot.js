var last_target = null;

function new_game() {
    var board = get_board();
    for(var fruit = 1; fruit - 1 < get_number_of_item_types(); fruit += 1) {
    }
}

function make_move() {
    var board = get_board();

    var my_x = get_my_x();
    var my_y = get_my_y();

    console.log('num of fruit '+get_number_of_item_types());

    var fruit_to_skip = {};
    var fruit_locations = {};
    var fruit_rarity = {};  // for each fruit, how many more do we need to win

    for(var fruit = 1; fruit - 1 < get_number_of_item_types(); fruit += 1) {
        
        fruit_locations[fruit] = [];

        var my_items    = get_my_item_count(fruit);
        var opp_items   = get_opponent_item_count(fruit);
        var total_items = get_total_item_count(fruit);
        var left_items  = total_items - my_items - opp_items;

        console.log('for fruit ' + fruit);
        //        console.log(': my  item(s) ' + my_items);
        //        console.log(': opp item(s) ' + opp_items);
        //        console.log(': tot item(s) ' + total_items);

        // amount remaining_fruit_needed_to_win
        var needed_to_win = Math.ceil(total_items / 2);
        var my_additional_fruit_needed = needed_to_win - my_items;
        var opp_additional_fruit_needed = needed_to_win - opp_items;

        if (my_additional_fruit_needed > 0) {
            fruit_rarity[fruit] = my_additional_fruit_needed;
        }

        var my_fruit_score = my_additional_fruit_needed;
        var opp_fruit_score = opp_additional_fruit_needed;

        console.log('my  score is '+my_fruit_score);
        console.log('opp score is '+opp_fruit_score);


        if (my_items > needed_to_win || opp_items > needed_to_win) {

            fruit_to_skip[fruit] = 1;

            for (var x = 0; x < board.length; x += 1) {
                for (var y = 0; y < board[x].length; y += 1) {
                    if (board[x][y] === fruit) {
                        ignore_coords.push([x,y]);
                    }
                }
            }
        }

        for (var k in fruit_to_skip)
            console.log('skipping fruit '+ k);


        fruit_locations[fruit] = find_locations_for_fruit({'fruit_type': fruit});
        console.log('fruit ' + fruit + ' exists ' + fruit_locations[fruit].length + ' times at:'); 
        for (var l = 0; l < fruit_locations[fruit].length; l++) {
            console.log(fruit_locations[fruit][l]);
        }
        


    }
        
        var rarest_fruit = -1;
        
        for (var fruit in fruit_rarity) {
            if (fruit_to_skip[fruit] != 1) { 
                if (rarest_fruit == -1 || fruit_rarity[rarest_fruit] >= fruit_rarity[fruit]) {
                    rarest_fruit = fruit;
                }
            }
        }

        console.log("rarest fruit is "+ rarest_fruit);




    if (board[my_x][my_y] > 0) {
        return TAKE;
    }

    var closest = find_highest_priority_fruit(fruit_to_skip);

    var board = get_board();

    var dir = Math.floor(Math.random() * 4);

    switch (dir) {
        case 1:
            return NORTH;
        case 2:
            return SOUTH;
        case 3:
            return EAST;
        default:
            return WEST;
    }

    return SKIP;
}

function find_locations_for_fruit(args) {
    var fruit = args['fruit_type'];
    console.log("looking for "+ fruit);
    var fruit_locations = [];
    var board = get_board();
   for (var x = 0; x < board.length; x += 1) {
       for (var y = 0; y < board[x].length; y += 1) {
           if (board[x][y] === fruit) {
               console.log("found!");
               fruit_locations.push([x,y]);
            }
        }
    }

   return fruit_locations;
}


/*
// find closest fruit
var target = find_highest_priority_fruit({
    ignore: ignore_coords
});

last_target = target;

// we found an item! take it!
if (board[my_x][my_y] > 0) {
    //See if this is an ignore coordinate
    var skip = false;
    for (var i = 1, l = ignore_coords.length; i < l; i += 1) {
        if ([my_x, my_y] === ignore_coords[i]) {
            skip = true;
        }
    }

    if (skip === false) {
        return TAKE;
    }
}

if (my_y > target[1]) {
    return NORTH;
}

if (my_y < target[1]) {
    return SOUTH;
}

if (my_x < target[0]) {
    return EAST;
}

if (my_x > target[0]) {
    return WEST;
}

return PASS;
}
*/

function find_highest_priority_fruit(args) {
    var board = get_board();
    var prioritized_board = [];

    for (var x = 0, xl = board.length; x < xl; x += 1) {
        for (var y = 0, yl = board[x].length; y < yl; y += 1) {
            if(board[x][y] > 0) {
                var skip = false;

                if (typeof(args) !== 'undefined') {
                    if (args[board[x][y]] == 1) {
                        skip = true;
                        break;
                    }
                }

                if(skip === false) {
                    var coord = {
                        'coord': [x,y],
                        'distance': distance_to_coord(x,y),
                        'rarity': get_total_item_count(board[x][y]) - get_opponent_item_count(board[x][y]) - get_my_item_count(board[x][y])
                    };

                    if (typeof(board[x+1]) !== 'undefined' && board[x+1] > 0) {
                        coord['closest_fruit'] = 1;
                    }

                    if (typeof(board[x-1]) !== 'undefined' && board[x-1] > 0) {
                        coord['closest_fruit'] = 1;
                    }

                    if (typeof(board[y+1]) !== 'undefined' && board[y+1] > 0) {
                        coord['closest_fruit'] = 1;
                    }

                    if (typeof(board[y-1]) !== 'undefined' && board[y-1] > 0) {
                        coord['closest_fruit'] = 1;
                    }

                    prioritized_board.push(coord);
                }
            }
        }
    }

    prioritized_board.sort(function(a,b) { return a.closest_fruit - b.closest_fruit });

    prioritized_board.sort(function(a,b) { return a.distance - b.distance });

    prioritized_board.sort(function(a,b) { return a.rarity - b.rarity });

    //See if the second highest priority coordinate is the last target, to prevent jumping, and replace
    if (typeof(prioritized_board[1]) !== 'undefined' && last_target === prioritized_board[1]['coord']) {
        return prioritized_board[1]['coord'];
    }

    return prioritized_board[0]['coord'];
}

function distance_to_coord(x,y) {
    var total_x = 0;
    var total_y = 0;

    var my_x = get_my_x();
    var my_y = get_my_y();

    if (x > my_x) {
        total_x += (x - my_x);
    }

    if (x < my_x) {
        total_x += (my_x - x);
    }

    if (y > my_y) {
        total_y += (y - my_y);
    }

    if (y < my_y) {
        total_y += (my_y - y);
    }

    return total_x + total_y;
}

// Optionally include this function if you'd like to always reset to a
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
