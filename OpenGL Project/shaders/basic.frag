#version 410 core

in vec3 fPosition;
in vec3 fNormal;
in vec2 fTexCoords;

out vec4 fColor;

//matrices
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;
//lighting
uniform vec3 lightDir;
uniform vec3 lightColor;
// textures
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;
//fog
uniform int activate_fog;
//components
vec3 ambient; 
float ambientStrength = 0.2f;
vec3 diffuse;
vec3 specular;
float specularStrength = 0.5f;

//pointLight
uniform int pointLight;
uniform vec3 lightPos1;
float shininess = 32.0f;

//globalLight
uniform int globalight;

float contant = 1.0f;
float linear = 0.7f;
float quadratic = 1.8f;

void computeDirLight()
{
    //compute eye space coordinates
    vec4 fPosEye = view * model * vec4(fPosition, 1.0f);
    vec3 normalEye = normalize(normalMatrix * fNormal);

    //normalize light direction
    vec3 lightDirN = vec3(normalize(view * vec4(lightDir, 0.0f)));

    //compute view direction (in eye coordinates, the viewer is situated at the origin
    vec3 viewDir = normalize(- fPosEye.xyz);

    //compute ambient light
    ambient = ambientStrength * lightColor;

    //compute diffuse light
    diffuse = max(dot(normalEye, lightDirN), 0.0f) * lightColor;

    //compute specular light
    vec3 reflectDir = reflect(-lightDirN, normalEye);
    float specCoeff = pow(max(dot(viewDir, reflectDir), 0.0f), 32);
    specular = specularStrength * specCoeff * lightColor;
}

float computeFog()
{
 vec4 fPosEye = view * model * vec4(fPosition, 1.0f);
 float fogDensity = 0.05f;
 float fragmentDistance = length(fPosEye);
 float fogFactor = exp(-pow(fragmentDistance * fogDensity, 2));

 return clamp(fogFactor, 0.0f, 1.0f);
}

vec3 computePointLight(vec4 lightPosEye)
{
float ambientStrength1 = 0.0001f;
float specularStrength1 = 0.0001f;
float shininess1 = 1.0f;
    vec4 fPosEye = view * model * vec4(fPosition, 1.0f);
	vec3 cameraPosEye = vec3(0.0f);
	vec3 normalEye = normalize(fNormal);
	//compute light direction
	vec3 lightDirN = normalize(lightPosEye.xyz - fPosEye.xyz);
	
	//compute distance to light
	float dist = length(lightPosEye.xyz - fPosEye.xyz);
	
	//compute attenuation
	
	float a = 3.0;
	float b = 4.0;
	//float att = 1.0f / (constant + linear * dist + quadratic * (dist * dist));
	float att=1.0f/(a * dist * dist + b * dist + 1.0f);
	
	//compute ambient light
	ambient = att * ambientStrength1 * lightColor;
	vec3 viewDirN = normalize(cameraPosEye - fPosEye.xyz);
	vec3 halfVector = normalize(lightDirN + viewDirN);

	float specCoeff = pow(max(dot(normalEye, halfVector), 0.0f), shininess1);
	//compute diffuse light
	diffuse = att * max(dot(normalEye, lightDirN), 0.0f) * lightColor;
	specular = att * specularStrength1 * specCoeff * lightColor;
	return (ambient + diffuse+specular)*att*vec3(2.0f,2.0f,2.0f);
}

void main() 
{
    computeDirLight();
    
    if(globalight==1)
	{
	computeDirLight();
	ambient *= texture(diffuseTexture, fTexCoords).rgb;
	diffuse *= texture(diffuseTexture, fTexCoords).rgb;
	specular *= texture(specularTexture, fTexCoords).rgb;
	}
    if(pointLight == 1){
        vec3 color = min((ambient + diffuse) * texture(diffuseTexture, fTexCoords).rgb + specular * texture(specularTexture, fTexCoords).rgb, 1.0f);
        vec4 lightPosEye1 = view * vec4(lightPos1, 1.0f);
        color += computePointLight(lightPosEye1);
    }
    if(activate_fog == 1){
        vec3 color = min((ambient + diffuse) * texture(diffuseTexture, fTexCoords).rgb + specular * texture(specularTexture, fTexCoords).rgb, 1.0f);
        float fogFactor = computeFog();
        vec4 fogColor = vec4(0.5f, 0.5f, 0.5f, 1.0f);
        fColor = mix(fogColor, vec4(color,1.0f), fogFactor);
    }else{
           vec3 color = min((ambient + diffuse) * texture(diffuseTexture, fTexCoords).rgb + specular * texture(specularTexture, fTexCoords).rgb, 1.0f);
           fColor = vec4(color, 1.0f);
    }  
   
    //compute final vertex color
    
}
