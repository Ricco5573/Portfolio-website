class Point{
    constructor(position){
        this.position = position;
    }
}

class Rectangle{
    constructor(position, size){
        this.position = position;
        this.size = size;
    }

    contains(point){
        if(point !== undefined){
        let pointPos = point.GetPosition();
        if(pointPos.x > this.position.x - this.size.x && pointPos.x < this.position.x + this.size.x
            && pointPos.y > this.position.y - this.size.y && pointPos.y < this.position.y + this.size.y
        ){
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
    }
}

class QuadTree{
    constructor(box, cap){
        this.box = box;
        this.capacity = cap;
        this.points = [];
        this.divided = false;
    }

    Update(){
        if(!this.divided){
        for(let p of this.points){
            if (!this.box.contains(p)){
                let ind = this.points.indexOf(p);
                this.points.splice(ind, 1);
                qt.insert(p);
            }
        }
    }
    else{
        this.NW.Update();
        this.NE.Update();
        this.SW.Update();
        this.SE.Update();
    }
    }

    subdivide(){
        let nwr = new Rectangle(createVector(this.box.position.x - this.box.size.x /2, this.box.position.y - this.box.size.y /2), createVector(this.box.size.x/2, this.box.size.y/2));
        this.NW = new QuadTree(nwr, this.capacity);
        let ner = new Rectangle(createVector(this.box.position.x + this.box.size.x /2, this.box.position.y - this.box.size.y /2), createVector(this.box.size.x/2, this.box.size.y/2))
        this.NE = new QuadTree(ner, this.capacity);
        let swr = new Rectangle(createVector(this.box.position.x - this.box.size.x /2, this.box.position.y + this.box.size.y /2), createVector(this.box.size.x/2, this.box.size.y/2));
        this.SW = new QuadTree(swr, this.capacity);
        let ser = new Rectangle(createVector(this.box.position.x + this.box.size.x /2, this.box.position.y + this.box.size.y /2), createVector(this.box.size.x/2, this.box.size.y/2))
        this.SE = new QuadTree(ser, this.capacity);
        this.divided = true;

    }
    insert(point){
        if(point !== undefined){
        if(!this.box.contains(point)){
            return;
        }
        if(this.points.length < this.capacity){

            this.points.push(point);
            point.SetTreeLayer(this.points);
            
        }
        else {
            if(!this.divided){
            this.subdivide();
            }
            this.NW.insert(point);
            this.NE.insert(point);
            this.SW.insert(point);
            this.SE.insert(point);
        }
    }
}
}