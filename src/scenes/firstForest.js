
class FForest extends Phaser.Scene {
    constructor(){
        super('fForestScene')
    }

    preload(){
    }
    create(){
        //debugging mode features
        debugCreate(this);   

        //set up the background
        this.blackDrop = this.add.sprite(screenHeight/2,screenWidth/2,'ground').setOrigin(0.5)
        this.blackDrop.displayHeight = screenHeight*2
        this.blackDrop.displayWidth = screenWidth*2
        this.backGround = this.add.sprite(0,screenHeight,'forBG').setOrigin(0,1)
        this.backTree1 = this.add.sprite(0,screenHeight,'forTree1').setOrigin(0,1)
        this.backTree2 = this.add.sprite(0,screenHeight,'forTree2').setOrigin(0,1)
        this.backFog = this.add.sprite(0,screenHeight,'forFog').setOrigin(0,1)
        this.backTree3 = this.add.sprite(0,screenHeight,'forTree3').setOrigin(0,1)
        this.backTree4 = this.add.sprite(0,screenHeight,'forTree4').setOrigin(0,1)
        this.forGround = this.add.sprite(0,screenHeight,'for1Ground').setOrigin(0,1)
        //set display size to fit screen
        this.backGround.displayWidth = screenWidth
        this.backFog.displayWidth = screenWidth
        this.backTree1.displayWidth = screenWidth
        this.backTree2.displayWidth = screenWidth
        this.backTree3.displayWidth = screenWidth
        this.backTree4.displayWidth = screenWidth
        this.forGround.displayWidth = screenWidth

        this.forGround.displayHeight = screenHeight*screenWidth/14400 //14400 is the actual width of the image
        this.backGround.displayHeight = screenHeight*screenWidth/14400
        this.backFog.displayHeight = screenHeight*screenWidth/14400
        this.backTree1.displayHeight = screenHeight*screenWidth/14400
        this.backTree2.displayHeight = screenHeight*screenWidth/14400
        this.backTree3.displayHeight = screenHeight*screenWidth/14400
        this.backTree4.displayHeight = screenHeight*screenWidth/14400





        //set up the ground
        this.ground = this.physics.add.sprite(screenCenterX, screenHeight - 5, 'ground').setScale(0.05); // Initialize our ground
        this.ground.setImmovable(true); // Sets ground to immovable
        this.ground.body.allowGravity = false; // So gravity has no effect ground
        this.ground.displayWidth = screenWidth;
        this.ground.setOrigin(0.5,0)
        //cave transition
        this.caveEntrance = this.physics.add.sprite(screenWidth/3,screenHeight-20,'caveEntrance').setOrigin(0.5,1)
        this.caveEntrance.displayHeight = 60
        this.caveEntrance.displayWidth = 60
        this.caveEntrance.body.allowGravity = false
        
        this.clearingEntrance = this.physics.add.sprite(7*screenWidth/8 - 100,screenHeight-20,'clearing').setOrigin(0.5,1)
        this.clearingEntrance.displayWidth = 60
        this.clearingEntrance.displayHeight = 60
        this.clearingEntrance.body.allowGravity = false

        //spawn collectables
        if(!hasBat){
            this.battery = this.physics.add.sprite(3*screenWidth/4,screenHeight - 20,'bat').setOrigin(0.5,1)
            this.battery.displayHeight = 10
            this.battery.displayWidth = 10
            this.battery.body.allowGravity = false
        }
        if(!hasFlash){
            this.light = this.physics.add.sprite(screenWidth/2,screenHeight - 20,'light').setOrigin(0.5,1)
            this.light.displayHeight = 10
            this.light.displayWidth = 10
            this.light.body.allowGravity = false
        }
        if(!hasKnife){
            this.knife = this.physics.add.sprite(screenWidth/6,screenHeight - 20,'knife').setOrigin(0.5,1)
            this.knife.displayWidth = 10
            this.knife.displayHeight = 10
            this.knife.body.allowGravity = false
        }

        // Setting up our player
        if(fromRavine){
            this.player = new player(this, 200, screenHeight-6, 'player').setScale(0.15).setOrigin(0.5,1); // Initialize our Player
            fromRavine = false
        }
        else{
            this.player = new player(this, screenWidth/3, screenHeight-6, 'player').setScale(0.15).setOrigin(0.5,1); // Initialize our Player
        }
        this.player.displayWidth = 30
        this.player.displayHeight = 30 

        //set up the camera following
        this.sceneCamera = this.cameras.main.startFollow(this.player);
        this.sceneCamera.setLerp(cameraLerp,cameraLerp)
        this.sceneCamera.zoom = 10
        this.sceneCamera.setBounds(0,screenHeight -1080*1920/14400,screenWidth,1080*1920/14400)

        //collide with the ground
        this.physics.add.collider(this.player, this.ground);

        //sound Effects
        this.giggle = this.sound.add('giggle')
        this.sfxConfig = {
            volume: 1,
            loop: false,
        }
        this.sfxActive = false;
        this.resetSFXactive = true;
        

        //object interactions
        this.noInstruct = true
        this.instructDestructor = true

        //collecting the battery
        this.physics.add.overlap(this.player,this.battery,()=>{
            if(this.noInstruct){
                this.instructions = this.add.text(this.battery.x,this.battery.y -40,'[space] to pick up',textConfig).setOrigin(0.5)
                this.instructions.setFontSize('10px')
                this.noInstruct = false
            }
            if(this.player.actionButton){
                this.instructions.destroy()
                this.battery.destroy()
                hasBat = true
                this.noInstruct = true;
            }
        })
        //collecting the light
        this.physics.add.overlap(this.player,this.light,()=>{
            if(this.noInstruct){
                this.instructions = this.add.text(this.light.x,this.light.y -40,'[space] to pick up',textConfig).setOrigin(0.5)
                this.instructions.setFontSize('10px')
                this.noInstruct = false
            } 
            console.log(this.player.actionButton)
            if(this.player.actionButton){
                this.instructions.alpha = 0;
                this.light.destroy()
                hasFlash = true
                this.noInstruct = true;
            }
        })
        //collecting the knife
        this.physics.add.overlap(this.player,this.knife,()=>{
            if(this.noInstruct){
                this.instructions = this.add.text(this.knife.x,this.knife.y -40,'[space] to pick up',textConfig).setOrigin(0.5)
                this.instructions.setFontSize('10px')
                this.noInstruct = false
            } 
            if(this.player.actionButton){
                this.instructions.alpha = 0;
                this.knife.destroy()
                hasKnife = true
                this.noInstruct = true;
            }
        })

        //deal with entering the cave
        this.physics.add.overlap(this.player,this.caveEntrance,()=>{
            if(this.noInstruct && hasFlash && hasBat){
                this.instructions = this.add.text(this.caveEntrance.x,this.caveEntrance.y -40,'[space] to enter',textConfig).setOrigin(0.5)
                this.instructions.setFontSize('10px')
                this.noInstruct = false
            } 
            else if (this.noInstruct){
                this.instructions = this.add.text(this.caveEntrance.x,this.caveEntrance.y -40,'It\'s dark in there',textConfig).setOrigin(0.5)
                this.instructions.setFontSize('10px')
                this.noInstruct = false
            }
            //transition to cave scene
            if(this.player.actionButton && hasBat && hasFlash){
                this.screentint =this.add.rectangle(screenWidth,screenHeight,screenWidth,screenHeight,0x000000).setOrigin(1)
                this.screentint.alpha = 0
                this.tweens.add({
                    targets: this.sceneCamera,
                    zoom: 10,
                    duration: 2000,
                    ease: 'linear'                     
                })
                this.tweens.add({
                    targets: this.screentint,
                    alpha: 1,
                    duration: 2000,     
                    ease: 'linear'               
                })
                this.time.addEvent({
                    delay: 2000,
                    callback: ()=> {
                        this.noInstruct = true;
                        this.scene.start('caveScene')
                    }
                })
            }
        })

        //deal with entering the clearing
        this.physics.add.overlap(this.player,this.clearingEntrance,()=>{
            if(!this.sfxActive){
                this.giggle.play(this.sfxConfig) 
                this.sfxActive = true;
            }
            if(this.noInstruct && hasAxe){
                this.instructions = this.add.text(this.clearingEntrance.x,this.clearingEntrance.y -200,'[space] to enter',textConfig).setOrigin(0.5)
                this.noInstruct = false
            } 
            else if (this.noInstruct){
                this.instructions = this.add.text(this.clearingEntrance.x,this.clearingEntrance.y -200,'It\'s too dense',textConfig).setOrigin(0.5)
                this.noInstruct = false
            }
            //transition to end scene
            if(this.player.actionButton && hasAxe){
                this.screentint =this.add.rectangle(screenWidth,screenHeight,screenWidth,screenHeight,0x000000).setOrigin(1)
                this.screentint.alpha = 0
                this.tweens.add({
                    targets: this.sceneCamera,
                    zoom: 10,
                    duration: 2000,
                    ease: 'linear'                     
                })
                this.tweens.add({
                    targets: this.screentint,
                    alpha: 1,
                    duration: 2000,     
                    ease: 'linear'               
                })
                this.time.addEvent({
                    delay: 2000,
                    callback: ()=> {
                        this.noInstruct = true;
                        this.scene.start('hEndScene')
                    }
                })
            }
        })
    }

    update(){
        //debugging mode features
        debugUpdate(this);
        this.player.update()

        //remove unused instructions
        if(!this.noInstruct && this.instructDestructor){
            this.instructDestructor = false
            this.time.addEvent({
                delay: instrctionDelay,
                callback: () => {
                    this.noInstruct = true
                    this.instructions.destroy()
                    this.instructDestructor = true
                }
            })
        }

        //reset sound effect
        if(this.sfxActive && this.resetSFXactive){
            this.resetSFXactive = false;
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.sfxActive = false
                    this.resetSFXactive = true
                }
            })
        }

        //paralax the background

        this.backFog.x = this.player.x/25
        this.backTree1.x = this.player.x/40
        this.backTree2.x = this.player.x/50
        this.backTree3.x = this.player.x/30
        this.backTree4.x = this.player.x/20


    }

}