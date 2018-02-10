class KeyInput {
    code: number;
    isDown: boolean;
    isUp: boolean;
    press: () => void;
    release: () => void;
    downHandler: (event: any) => void;
    upHandler: (event: any) => void;

    constructor(keyCode: number) {
        this.code = keyCode;
        this.isDown = false;
        this.isUp = true;

        //The `downHandler`
        this.downHandler = event => {
            if (event.keyCode === this.code) {
                if (this.isUp && this.press) this.press();
                this.isDown = true;
                this.isUp = false;
            }
            event.preventDefault();
        };

        //The `upHandler`
        this.upHandler = event => {
            if (event.keyCode === this.code) {
                if (this.isDown && this.release) this.release();
                this.isDown = false;
                this.isUp = true;
            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", this.downHandler.bind(this), false
        );
        window.addEventListener(
            "keyup", this.upHandler.bind(this), false
        );
    }
}

export default KeyInput;