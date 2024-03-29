import Ship from '/InDecisionTeam/ship.js';
export default class Player extends Ship{
    constructor(scene){
        super(scene, 700, 400, 500, 'playerNew', 10);
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
        this.body.setSize(42, 22, false);           //Ajusta la caja de colisiones
        this.body.setOffset(21, 22);
        this.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 600, 1400, 200));
        this.parry = false;
        this.cooldown = 0;
        this.parryAT = 1000;    //active time
        this.parryCD = 400;    //cooldown
        this.spacebar = this.scene.input.keyboard.addKey('SPACE');
        this.nextFrame = 0;
        this.immune = false;
        this.flashAnim = null;     
    }
    preUpdate(t, dt){
        this.cooldown = Math.max(0, this.cooldown - dt);
        if(this.spacebar.isDown && this.cooldown == 0){
            this.body.setSize(42, 44, false);
            this.body.setOffset(21, 0);
            this.nextFrame++;
            this.setFrame(this.nextFrame);
            this.parry = true;
            this.cooldown = this.parryAT;                               //despues de X ms puede volver a hacerlo
        } else if(this.parry && this.cooldown < this.parryCD){
            this.parry = false;                                         //después de X ms deja de devolver proyectiles
            this.nextFrame = (this.nextFrame + 1) % 4;
            this.setFrame(this.nextFrame); 
            this.body.setSize(42, 22, false);
            this.body.setOffset(21, 22);
        }
    }
    receiveDamage(damage){
        this.scene.scene.manager.getScene("hud").updateHealth(this.health - damage);
        this.body.reset(700 - this.body.halfWidth, 600);
        this.health -= damage;
        if(this.health > 0){
            this.flashAnim = this.scene.time.addEvent({delay: 125, callback: this.flash, callbackScope: this, loop: true});
            this.setTint(0xff0000);
            this.immune = true;
            var timer = this.scene.time.delayedCall(5000, this.deactivateImmunity, null, this);
        }else this.scene.endMenu();
    }
    deactivateImmunity(){
        console.log("deinmune");
        this.immune = false;
        this.flashAnim.remove();
        this.setVisible(true);
        this.clearTint();
    }
    getHealth(){
        return this.health;
    }
    flash(){
        if(this.visible)
            this.setVisible(false);
        else this.setVisible(true);
    }
}