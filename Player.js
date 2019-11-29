import Ship from '/InDecisionTeam/ship.js';
export default class Player extends Ship{
    constructor(scene){
        super(scene, 400, 400, 300, 'testo', 100)
        this.d = this.scene.input.keyboard.addKey('D');
        this.a = this.scene.input.keyboard.addKey('A');
        this.s = this.scene.input.keyboard.addKey('S');
        this.w = this.scene.input.keyboard.addKey('W');
        this.d.on('down', event => {this.setVelocityX(1)});
        this.a.on('down', event => {this.setVelocityX(-1)});
        this.s.on('down', event => {this.setVelocityY(1)});
        this.w.on('down', event => {this.setVelocityY(-1)});
        this.d.on('up', event => {if(this.body.velocity.x > 0)this.setVelocityX(0)});
        this.a.on('up', event => {if(this.body.velocity.x < 0)this.setVelocityX(0)});
        this.s.on('up', event => {if(this.body.velocity.y > 0)this.setVelocityY(0)});
        this.w.on('up', event => {if(this.body.velocity.y < 0)this.setVelocityY(0)});
        this.parry = false;
        this.cooldown = 0;
        this.parryAT = 1500;    //active time
        this.parryCD = 3000;    //cooldown
        this.p = this.scene.input.keyboard.addKey('P');
    }
    preUpdate(t, dt){
        this.cooldown = Math.max(0, this.cooldown - dt);
        if(this.p.isDown && this.cooldown == 0){
            this.parry = true;
            this.cooldown = this.parryCD;                               //despues de X ms puede volver a hacerlo
        } else if(this.cooldown < this.parryAT) this.parry = false;     //después de X ms deja de devolver proyectiles
    }
}