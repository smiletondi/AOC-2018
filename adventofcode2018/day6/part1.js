

let input=`154, 159
172, 84
235, 204
181, 122
161, 337
305, 104
128, 298
176, 328
146, 71
210, 87
341, 195
50, 96
225, 151
86, 171
239, 68
79, 50
191, 284
200, 122
282, 240
224, 282
327, 74
158, 289
331, 244
154, 327
317, 110
272, 179
173, 175
187, 104
44, 194
202, 332
249, 197
244, 225
52, 127
299, 198
123, 198
349, 75
233, 72
284, 130
119, 150
172, 355
147, 314
58, 335
341, 348
236, 115
185, 270
173, 145
46, 288
214, 127
158, 293
237, 311`;


const tabcoord= input=>{
    let y=input.split(/\n/g).map(e=>{ 
        return e.split(",").map(Number);
    });
    return y;
};
const manhattandist=(tab1[],tab2[])=>{
    return( Math.abs(tab1[0]-tab2[0]) + Math.abs[tab1[1]-tab1[1]]);
};


let data=input;

let coords = tabcoord(input);
var highestx = coords.sort((a, b) => b[0] - a[0])[0][0] + 1;
var highesty = coords.sort((a, b) => b[1] - a[1])[0][1] + 1 ;
let count = [];
var infinite = [];
for(var i = 0; i < highestx; i++){
    for(var j = 0; j < highesty; j++){
        var c = coords.map(a => {return {coord: a, distance: Math.abs(a[0] - i) + Math.abs(a[1] - j)}}).sort((a, b) => a.distance - b.distance);
        if(c[0].distance == c[1].distance){
            continue;
        }
        if(i == 0 || i == highestx - 1)
            infinite.push(c[0].coord)
        if(j == 0 || j == highesty - 1)
            infinite.push(c[0].coord)
        
        
        var coord = c[0].coord;
        count[coord] = count[coord] ? count[coord] + 1 : 1;
    }
}
var infinite = infinite.filter((a, i) => i == infinite.indexOf(a)).map(a => a.toString());

var sortable = []
for(var i in count){
    sortable.push([i, count[i]])
}
var result = sortable.sort((a, b) => b[1] - a[1]).filter(a => !infinite.includes(a[0]))[0][1];

console.log(result);  