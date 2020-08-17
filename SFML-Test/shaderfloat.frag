#version 430

uniform int screenx;
uniform int screeny;

uniform float scalex;
uniform float scaley;

uniform vec3 viewport;

uniform int thickness;
uniform int mode;
uniform int iterations;

uniform float a;

uniform float margin;

uniform mat4x4 functionx;
uniform mat4x4 functiony;

vec2 P(in vec2 pos){
	return vec2(-pos.x -pos.y, pos.x*pos.y);
}

vec2 pq(in vec2 pos){
	return vec2(-pos.x/2 + sqrt(pos.x*pos.x/4-pos.y), -pos.x/2 - sqrt(pos.x*pos.x/4-pos.y));
}

vec3 P3(in vec3 pos){
	return vec3(-pos.x -pos.y -pos.z, pos.x*pos.y+pos.y*pos.z+pos.z*pos.x, -pos.x*pos.y*pos.z);
}

vec2 M(in vec2 pos, in vec2 pos0){
	return vec2(pos.x*pos.x-pos.y*pos.y+pos0.x,2*pos.x*pos.y+pos0.y);
}

vec2 C(in vec2 pos){

	vec4 powx;
	vec4 powy;

	for(int i = 0; i < 4; i++){
		powx[i] = pow(float(pos.x), float(i));
		powy[i] = pow(float(pos.y), float(i));
	}

	return vec2(dot(functionx*powx, powy), dot(functiony*powx,powy));
}

vec2 P1(in vec2 pos){
	return vec2(-pos.x*pos.x+pos.y*pos.y-pos.x,2*pos.x*pos.y-pos.y);
}

vec3 getpos(in vec2 xy){

	float relative_x = xy.x / float(screeny);
	float relative_y = xy.y / float(screeny);

	return vec3(vec2((relative_x - 0.5 * float(screenx)/float(screeny)) * scalex, (relative_y - 0.5) * scaley) + viewport.xy, viewport.z);
}

vec4 variety()
{
	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec3 pos = getpos(gl_FragCoord.xy);	
	vec3 posdx = pos + vec3(dx, 0, 0);
	vec3 pos_dx = pos - vec3(dx, 0, 0);
	vec3 posdy = pos + vec3(0, dy, 0);
	vec3 pos_dy = pos - vec3(0, dy, 0);


	for(int k = 0; k < iterations; k++){
		
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((sign(posdx.x-a) != sign(pos_dx.x-a)) || (sign(posdy.x-a) != sign(pos_dy.x-a))) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
		//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
			return vec4(0, 0, 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}




vec4 coloringmain()
{

	vec3 pos = getpos(gl_FragCoord.xy);

	for(int k = 0; k < iterations; k++){
	
		pos = P3(pos);
	
		if (length(pos) > 100) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			return vec4(1.0/sqrt(float(k)/2.0), 0, 0, 1);
		
		}
		else if(abs(pos.y) < margin ){
			return vec4(0, 1.0/sqrt(sqrt(float(k)/2.0)), 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 combined()
{

	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec3 pos = getpos(gl_FragCoord.xy);
	vec3 posdx = pos + vec3(dx, 0, 0);
	vec3 pos_dx = pos - vec3(dx, 0, 0);
	vec3 posdy = pos + vec3(0, dy, 0);
	vec3 pos_dy = pos - vec3(0, dy, 0);

	for(int k = 0; k < iterations; k++){
		
		pos = P3(pos);
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((sign(posdx.x-a) != sign(pos_dx.x-a)) || (sign(posdy.x-a) != sign(pos_dy.x-a))) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		}
//		else if ((posdx.x - 1.0) * (pos_dx.x - 1.0) < 0.0 || (posdy.x - 1.0) * (pos_dy.x - 1.0) < 0.0){
//			vec4 ret = (k % 2 == 1) ? vec4(1, 0, 0, 1) : vec4(1, 0, 1, 1);
//			return ret;
//		}
				if (length(pos) > 100) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			return vec4(1.0/sqrt(float(k)/2.0), 0, 0, 1);
		
		}
		else if(abs(pos.y) < margin ){
			return vec4(0, 1.0/sqrt(sqrt(float(k)/2.0)), 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}

vec4 dreieck(){

	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec3 pos = getpos(gl_FragCoord.xy);
	vec3 posdx = pos + vec3(dx, 0, 0);
	vec3 pos_dx = pos - vec3(dx, 0, 0);
	vec3 posdy = pos + vec3(0, dy, 0);
	vec3 pos_dy = pos - vec3(0, dy, 0);

	bool drin = true;

	for(int k = 0; k < iterations; k++){
	
		pos = P3(pos);
		posdx = P3(posdx);
		pos_dx = P3(pos_dx);
		posdy = P3(posdy);
		pos_dy = P3(pos_dy);

		if ((sign(posdx.x-a) != sign(pos_dx.x-a)) || (sign(posdy.x-a) != sign(pos_dy.x-a))) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		}
//		if ((posdx.x-a) * (pos_dx.x-a) < 0.0 || (posdy.x-a) * (pos_dy.x-a) < 0.0) {
//
//			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
//			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
//			return vec4(1.0, 0.6, 0, 1);
//		}

		drin = drin && (pos.x < a);
		//drin = drin && (length(pos) < length(vec2(1,-2)));

	}

	return drin? vec4(0, 0, 1, 1) : vec4(1,1,1,1);

}


vec4 mandelbrot(){
	
	float dx = thickness/2.0*scalex/float(screenx);
	float dy = thickness/2.0*scaley/float(screeny);

	vec2 pos0 = getpos(gl_FragCoord.xy).xy;
	vec2 pos = pos0;

	vec2 posdx = pos + vec2(dx, 0);
	vec2 pos_dx = pos - vec2(dx, 0);
	vec2 posdy = pos + vec2(0, dy);
	vec2 pos_dy = pos - vec2(0, dy);

	vec2 posdx0 = posdx;
	vec2 pos_dx0 = pos_dx;
	vec2 posdy0 = posdy;
	vec2 pos_dy0 = pos_dy;

	for(int k = 0; k < iterations; k++){
	
//		//pos = M(pos, pos0);
//		pos = P1(pos);
//		if(length(pos) > 2.0)
//			return vec4(1, 1, 1, 1);

		pos = M(pos, pos0);
		posdx = M(posdx, posdx0);
		pos_dx = M(pos_dx, pos_dx0);
		posdy = M(posdy, posdy0);
		pos_dy = M(pos_dy, pos_dy0);
		}
		if ((sign(length(posdx)-2.0) != sign(length(pos_dx)-2.0)) || (sign(length(posdy)-2.0) != sign(length(pos_dy)-2.0))) {

			//gl_FragColor = texture2D(color, vec2(float(k)/float(iterations),0));
			//gl_FragColor = texture2D(color, vec2(float(k)/float(maxiter),0));
			return vec4(1.0, 0.6, 0, 1);
		

	
	}
	return vec4(1,1,1,1);
	//return vec4(0,0,0,1);

}

vec4 cringe(){
	
	float dx = float(thickness)/2.0*scalex/float(screenx);
	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec2 pos = getpos(gl_FragCoord.xy).xy;	
	vec2 posdx = pos + vec2(dx, 0);
	vec2 pos_dx = pos - vec2(dx, 0);
	vec2 posdy = pos + vec2(0, dy);
	vec2 pos_dy = pos - vec2(0, dy);


	for(int k = 0; k < iterations; k++){
		
		posdx = C(posdx);
		pos_dx = C(pos_dx);
		posdy = C(posdy);
		pos_dy = C(pos_dy);

		if ((sign(posdx.x-a) != sign(pos_dx.x-a)) || (sign(posdy.x-a) != sign(pos_dy.x-a))) {

			return vec4(0, 0, 0, 1);
		}

	}

	return vec4(1,1,1,1);
    
}


 vec4 oldie()
{

//	float dx = float(thickness)/2.0*scalex/float(screenx);
//	float dy = float(thickness)/2.0*scaley/float(screeny);

	vec2 pos = getpos(gl_FragCoord.xy).xy;
//	vec2 posdx = pos + vec2(dx, 0);
//	vec2 pos_dx = pos - vec2(dx, 0);
//	vec2 posdy = pos + vec2(0, dy);
//	vec2 pos_dy = pos - vec2(0, dy);
//
	for(int k = 0; k < iterations; k++){
		
		pos = P(pos);
		if(abs(pos.x) < margin)
			return vec4(0, 0, 0, 1);

//		posdx = P(posdx);
//		pos_dx = P(pos_dx);
//		posdy = P(posdy);
//		pos_dy = P(pos_dy);
//
//		if  ((length(posdx) - 1.0) * (length(pos_dx) - 1.0) < 0.0 || (length(posdy)-1.0) * (length(pos_dy) - 1.0) < 0.0){
//			return vec4(0, 0, 0, 1);
//		}

	}

	return vec4(1,1,1,1);
    
}

void main(){

	switch(mode){
	case 0:
	{
		gl_FragColor = variety();
		break;
	}
	
	case 1:
	{
		gl_FragColor = coloringmain();
		break;
	}
	case 2:
	{
		gl_FragColor = combined();
		break;
	}
	case 3:
	{
		gl_FragColor = dreieck();
		break;
	}

	case 4:
	{
		gl_FragColor = mandelbrot();
		break;
	}

	case 5:
	{
		gl_FragColor = cringe();
		break;
	}

	case 6:
	{
		gl_FragColor = oldie();
		break;
	}
	
	default:
		gl_FragColor = vec4(0, 0, 0, 0);
		break;
	}
}
