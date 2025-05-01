function drawthesheep() {
    var Sheep_white = [1, 1, 1, 1];
    var face_color = [1, .9, .65, 1.0];

    var body = new Cube();
    body.color = Sheep_white;
    body.matrix.translate(10.125, g_set_Location+0.2 +0.2, 7.15);
    body.matrix.translate(-0.5, -0.5, -0.5);
    body.matrix.scale(.7, .7, .7);
    body.drawCubeFast();

    var head = new Cube();
    head.color =[0.9, 0.9, 0.85, 1]
    head.matrix.translate(10, g_set_Location+0.2, 7);
    head.matrix.rotate(-head_animation, 1, 0, 0);
    head.matrix.scale(0.4, 0.4, 0.4);
    head.matrix.translate(-0.5, 0.65, -1.5);
    head.drawCubeFast();

    var sheep_face = new Cube();
    sheep_face.color = face_color;
    sheep_face.matrix.translate(10, g_set_Location+0.2, 7);
    sheep_face.matrix.rotate(-head_animation, 1, 0, 0);
    sheep_face.matrix.scale(0.4, 0.4, 0.03);
    sheep_face.matrix.translate(-0.5, 0.65, -21);
    sheep_face.drawCubeFast();

    var tophair = new Cube();
    tophair.color = Sheep_white;
    tophair.matrix.translate(10, g_set_Location+0.2, 7);
    tophair.matrix.rotate(-head_animation, 1, 0, 0);
    tophair.matrix.scale(0.4, 0.075, 0.04);
    tophair.matrix.translate(-0.5, 7.8, -16.5);
    tophair.drawCubeFast();

    var left_hair = new Cube();
    left_hair.color = Sheep_white;
    left_hair.matrix.translate(10, g_set_Location+0.2, 7);
    left_hair.matrix.rotate(-head_animation, 1, 0, 0);
    left_hair.matrix.scale(0.05, 0.071, 0.04);
    left_hair.matrix.translate(-4, 7.3, -16.5);
    left_hair.drawCubeFast();

    var botrighthair = new Cube();
    botrighthair.color = Sheep_white;
    botrighthair.matrix.translate(10, g_set_Location+0.2, 7);
    botrighthair.matrix.rotate(-head_animation, 1, 0, 0);
    botrighthair.matrix.scale(0.05, 0.071, 0.04);
    botrighthair.matrix.translate(3, 7.3, -16.5);
    botrighthair.drawCubeFast();

    var lefteye = new Cube();
    lefteye.color = [1, 1, 1, 1];
    lefteye.matrix.translate(10, g_set_Location+0.2, 7);
    lefteye.matrix.rotate(-head_animation, 1, 0, 0);
    lefteye.matrix.scale(0.1, 0.061, 0.04);
    lefteye.matrix.translate(-1.5, 7, -16.2);
    lefteye.drawCubeFast();

    var lefteyeblack = new Cube();
    lefteyeblack.color = [0, 0, 0, 1];
    lefteyeblack.matrix.translate(10, g_set_Location+0.2, 7);
    lefteyeblack.matrix.rotate(-head_animation, 1, 0, 0);
    lefteyeblack.matrix.scale(0.05, 0.061, 0.04);
    lefteyeblack.matrix.translate(-3, 7, -16.5);
    lefteyeblack.drawCubeFast();

    var righteye = new Cube();
    righteye.color = [1, 1, 1, 1];
    righteye.matrix.translate(10, g_set_Location+0.2, 7);
    righteye.matrix.rotate(-head_animation, 1, 0, 0);
    righteye.matrix.scale(0.1, 0.061, 0.04);
    righteye.matrix.translate(0.5, 7, -16.2);
    righteye.drawCubeFast();

    var righteyeblack = new Cube();
    righteyeblack.color = [0, 0, 0, 1];
    righteyeblack.matrix.translate(10, g_set_Location+0.2, 7);
    righteyeblack.matrix.rotate(-head_animation, 1, 0, 0);
    righteyeblack.matrix.scale(0.05, 0.061, 0.04);
    righteyeblack.matrix.translate(2, 7, -16.5);
    righteyeblack.drawCubeFast();

    var mouth1 = new Cube();
    mouth1.color = [1, .8, 0.8, 1];
    mouth1.matrix.translate(10, g_set_Location+0.2, 7);
    mouth1.matrix.rotate(0, 1, 0, 0);
    mouth1.matrix.rotate(-head_animation, 1, 0, 0);
    mouth1.matrix.scale(0.1, 0.071, 0.04);
    mouth1.matrix.translate(-0.47, 4.2, -16.1);
    mouth1.drawCubeFast()

    var mouth2 = new Cube();
    mouth2.color = [0, 0, 0, 1];
    mouth2.matrix.translate(10, g_set_Location+0.2, 7);
    mouth2.matrix.rotate(0, 1, 0, 0);
    mouth2.matrix.rotate(-head_animation, 1, 0, 0);
    mouth2.matrix.scale(0.05, 0.07, 0.04);
    mouth2.matrix.translate(-0.47, 4.5, -16);
    mouth2.drawCubeFast()

    var face_down_mao = new Cube();
    face_down_mao.color = [1, 0.3, 0.2, 1];
    face_down_mao.matrix.translate(10, g_set_Location+0.2, 7);
    face_down_mao.matrix.rotate(-head_animation, 1, 0, 0);
    face_down_mao.matrix.scale(0.1, 0.1, 0.04);
    face_down_mao.matrix.translate(1, 2.6, -16.2);
    face_down_mao.drawCubeFast()

    var face_down_mao2 = new Cube();
    face_down_mao2.color = [1, 0.3, 0.2, 1];
    face_down_mao2.matrix.translate(10, g_set_Location+0.2, 7);
    face_down_mao2.matrix.rotate(-head_animation, 1, 0, 0);
    face_down_mao2.matrix.scale(0.1, 0.1, 0.04);
    face_down_mao2.matrix.translate(-2.1, 2.6, -16.2);
    face_down_mao2.drawCubeFast()

    var frontleftleg = new Cube();
    frontleftleg.color = Sheep_white;
    //frontleftleg.matrix.setTranslate(0,0, 0);
    frontleftleg.matrix.translate(10,g_set_Location+0.2,7)
    frontleftleg.matrix.rotate(-g_Angle,1,0,0); // Joint 1
    var frontleftlegCoord = new Matrix4(frontleftleg.matrix);
    frontleftleg.matrix.scale(.15, -0.25, 0.15);
    frontleftleg.matrix.translate(-1.7, 1.2, -2);
    frontleftleg.drawCubeFast();

    var frontrightleg = new Cube();
    frontrightleg.matrix.translate(10,g_set_Location+0.2,7)
    frontrightleg.color = Sheep_white;
    //frontrightleg.matrix.setTranslate(0, 0, 0);
    frontrightleg.matrix.rotate(g_Angle,1,0,0); // Joint 1
    var frontrightlegCoord = new Matrix4(frontrightleg.matrix);
    frontrightleg.matrix.scale(.15, -0.25, 0.15);
    frontrightleg.matrix.translate(0.8, 1.2, -2);
    frontrightleg.drawCubeFast();

    var backleftlegs = new Cube();
    backleftlegs.color = Sheep_white;
    backleftlegs.matrix.translate(10,g_set_Location+0.2,7)
    //backleftlegs.matrix.setTranslate(0, 0, 0);
    backleftlegs.matrix.rotate(-g_Angle, 1, 0, 0); // Joint 1
    var backleftlegsCoord = new Matrix4(backleftlegs.matrix);
    backleftlegs.matrix.scale(.15, -0.25, 0.15);
    backleftlegs.matrix.translate(-1.7, 1.2, 1);
    backleftlegs.drawCubeFast();

    var backright = new Cube();
    backright.color = Sheep_white;
    backright.matrix.translate(10,g_set_Location+0.2,7)
    //backright.matrix.setTranslate(0, 0, 0);
    backright.matrix.rotate(g_Angle, 1, 0, 0); // Joint 1
    var backrightCoord = new Matrix4(backright.matrix);
    backright.matrix.scale(.15, -0.25, 0.15);
    backright.matrix.translate(.8, 1.2, 1);
    backright.drawCubeFast();

    var frontleftleglow = new Cube();
    frontleftleglow.color = face_color;
    frontleftleglow.matrix.translate(10,g_set_Location+0.2,7)
    frontleftleglow.matrix = frontleftlegCoord;
    frontleftleglow.matrix.rotate(-g_Angle2, 1, 0, 0);
    frontleftleglow.matrix.scale(0.1, 0.1, 0.1);
    frontleftleglow.matrix.translate(-2.25, -6.4,-2.6);
    frontleftleglow.drawCubeFast();

    var frontrightleglow = new Cube();
    frontrightleglow.color = face_color;
    frontrightleglow.matrix.translate(10,g_set_Location+0.2,7)
    frontrightleglow.matrix = frontrightlegCoord;
    frontrightleglow.matrix.rotate(g_Angle2, 1, 0, 0);
    frontrightleglow.matrix.scale(0.1, 0.1, 0.1);
    frontrightleglow.matrix.translate(1.5, -6.4, -2.6);
    frontrightleglow.drawCubeFast();

    var backleftlegslow = new Cube();
    backleftlegslow.color = face_color;
    backleftlegslow.matrix.translate(10,g_set_Location+0.2,7)
    backleftlegslow.matrix = backleftlegsCoord;
    backleftlegslow.matrix.rotate(-g_Angle2, 1, 0, 0);
    backleftlegslow.matrix.scale(0.1, 0.1, 0.1);
    backleftlegslow.matrix.translate(-2.25, -6.4, 1.6);
    backleftlegslow.drawCubeFast();

    var backrightlow = new Cube();
    backrightlow.color = face_color;
    backrightlow.matrix.translate(10,g_set_Location+0.2,7)
    backrightlow.matrix = backrightCoord;
    backrightlow.matrix.rotate(g_Angle2, 1, 0, 0);
    backrightlow.matrix.scale(0.1, 0.1, 0.1);
    backrightlow.matrix.translate(1.5, -6.4, 1.76);
    backrightlow.drawCubeFast();

    var tails = new Cube();
    tails.color = [0.85, 0.85, 0.85, 1]
    tails.matrix.translate(10,g_set_Location+0.2,7)
    tails.matrix.setTranslate(0, 0, 0);
    if(Shift_and_Click){
        tails.matrix.rotate(g_tails_animation, 1, 0, 0)
    }else{
        tails.matrix.rotate(g_tails_animation, 0, 1, 0)
    }
    var TailOneCoord = new Matrix4(tails.matrix);
    tails.matrix.scale(0.2, 0.2, 0.2)
    tails.matrix.translate(-0.5, 0.6, 1.1)
    tails.drawCubeFast();

    var second_tails = new Cube();
    second_tails.color = [0.85, 0.85, 0.85, 1]
    second_tails.matrix.translate(10,g_set_Location+0.2,7)
    second_tails.matrix = TailOneCoord;
    if(Shift_and_Click){
        second_tails.matrix.rotate(g_tails_animation, 1, 0, 0)
    }else{
        second_tails.matrix.rotate(g_tails_animation, 0, 1, 0)
    }
    var TailSecondCoord = new Matrix4(second_tails.matrix);
    second_tails.matrix.scale(0.15, 0.15, 0.15)
    second_tails.matrix.translate(-0.5, 1, 2.5)
    second_tails.drawCubeFast();

    var third_tails = new Four_pyramid();
    third_tails.color = [0.2, 0.2, 0.2, 1]
    third_tails.matrix = TailSecondCoord;
    if(Shift_and_Click){
        third_tails.matrix.rotate(g_tails_animation, 1, 0, 0)
    }else {
        third_tails.matrix.rotate(g_tails_animation, 0, 1, 0)
    }
    var TailThirdCoord = new Matrix4(third_tails.matrix);
    third_tails.matrix.scale(0.13, 0.13, 0.13)
    third_tails.matrix.translate(-0.5, 1.2, 4)
    third_tails.render();

}