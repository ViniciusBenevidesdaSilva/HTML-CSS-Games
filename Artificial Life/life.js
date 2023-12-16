

document.addEventListener("DOMContentLoaded", function () {
    let SCREEN_SIZE = 900;

    canvas=document.getElementById("life");
    canvas.height=SCREEN_SIZE;
    canvas.width=SCREEN_SIZE;

    m=canvas.getContext("2d");

    draw=(x,y,c,s) => {
        m.fillStyle=c;
        m.fillRect(x, y, s, s);
    }
    
    particles=[]
    particle=(x,y,c)=>{
        return{ "x": x, "y": y, "vx": 0, "vy": 0, "color": c };
    }

    random=()=>{
        return Math.random() * (SCREEN_SIZE * 0.95);
    }

    create=(number, color)=>{
        group=[];
        for(let i=0; i<number; i++){
            group.push(particle(random(), random(), color));
            particles.push(group[i]);
        }
        return group;
    }

    rule=(particles1, particles2, g)=>{

        for(let i=0; i < particles1.length; i++){

            fx = 0;
            fy = 0;

            for(let j=0; j < particles2.length; j++){

                a = particles1[i];
                b = particles2[j];
                dx = a.x - b.x;
                dy = a.y - b.y;

                d = Math.sqrt(dx*dx + dy*dy);

                if(d > 0 && d < (SCREEN_SIZE / 10)){
                    F = g * 1 / d;
                    fx += (F * dx);
                    fy += (F * dy);
                }

                a.vx = (a.vx + fx) * 0.03;
                a.vy = (a.vy + fy) * 0.03;

                if(a.x <= Math.abs(a.vx) || a.x > (SCREEN_SIZE - Math.abs(a.vx))) { a.vx *= -1; }
                if(a.y <= Math.abs(a.vy) || a.y > (SCREEN_SIZE - Math.abs(a.vy))) { a.vy *= -1; }
            
                a.x += a.vx;
                a.y += a.vy;
            }
        }
    }

    yellow = create(Math.random() * 200 + 10, "yellow");
    red = create(Math.random() * 200 + 10, "red");
    green = create(Math.random() * 200 + 10, "green");


    groups = [yellow, red, green];

    createRules=()=>{
        rules = []

        for(let i=0; i<groups.length; i++){
            for(let j=0; j<groups.length; j++){
                if(Math.random() > 0.2){
                    let force = Math.random() * 2 - 1;
                    rules.push(() => rule(groups[i], groups[j], force));
                }
            }
        }
        return rules;
    }

    rules = createRules();

    update=()=>{
        for(let i=0; i<rules.length; i++){
            rules[i]();
        }

        m.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE);

        draw(0, 0, "black", SCREEN_SIZE);

        for(i=0;i<particles.length;i++){
            draw(particles[i].x, particles[i].y, particles[i].color, 5);
        }

        requestAnimationFrame(update);
    }

    update();

});



