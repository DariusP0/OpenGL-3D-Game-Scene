#include "Camera.hpp"

namespace gps {

    //Camera constructor
    Camera::Camera(glm::vec3 cameraPosition, glm::vec3 cameraTarget, glm::vec3 cameraUp) {
        //TODO
        this->cameraPosition = cameraPosition;
        this->cameraTarget = cameraTarget;
        this->cameraUpDirection = cameraUp;
        
    }

    //return the view matrix, using the glm::lookAt() function
    glm::mat4 Camera::getViewMatrix() {
        return glm::lookAt(cameraPosition, cameraTarget, cameraUpDirection);
    }

    //update the camera internal parameters following a camera move event
    void Camera::move(MOVE_DIRECTION direction, float speed) {
       
        switch (direction) {
        case MOVE_RIGHT:
            this->cameraPosition.x += speed;
            this->cameraTarget.x += speed;
            break;
        case MOVE_LEFT:
            this->cameraPosition.x -= speed;
            this->cameraTarget.x -= speed;
            break;
        case MOVE_FORWARD:
            this->cameraPosition.z -= speed;
            this->cameraTarget.z -= speed;
            break;
        case MOVE_BACKWARD:
            this->cameraPosition.z += speed;
            //this->cameraTarget.z += speed;
            break;

        case LOOK_DOWN:
            this->cameraTarget.y -= speed;
            break;

        case LOOK_UP:
            this->cameraTarget.y += speed;
            break;

        case MOVE_DOWN:
            this->cameraPosition.y -= speed;
            break;


        case MOVE_UP:
            this->cameraPosition.y += speed;
            break;

        }
    }

    //update the camera internal parameters following a camera rotate event
    //yaw - camera rotation around the y axis
    //pitch - camera rotation around the x axis
    void Camera::rotate(float pitch, float yaw) {
        // Rotate the camera position around the y-axis (yaw)
        glm::mat4 yawRotation = glm::rotate(glm::mat4(1.0f), glm::radians(yaw), glm::vec3(0.0f, 1.0f, 0.0f));
        this->cameraPosition = glm::vec3(yawRotation * glm::vec4(this->cameraPosition, 1.0f));

        // Rotate the camera position around the x-axis (pitch)
        glm::mat4 pitchRotation = glm::rotate(glm::mat4(1.0f), glm::radians(pitch), glm::normalize(glm::cross(this->cameraUpDirection, this->cameraTarget - this->cameraPosition)));
        this->cameraPosition = glm::vec3(pitchRotation * glm::vec4(this->cameraPosition, 1.0f));

        // Rotate the camera target around the y-axis (yaw)
        this->cameraTarget = glm::vec3(yawRotation * glm::vec4(this->cameraTarget, 1.0f));

        // Rotate the camera up direction around the y-axis (yaw)
        this->cameraUpDirection = glm::vec3(yawRotation * glm::vec4(this->cameraUpDirection, 1.0f));

        // Rotate the camera up direction around the x-axis (pitch)
        this->cameraUpDirection = glm::vec3(pitchRotation * glm::vec4(this->cameraUpDirection, 1.0f));
    }

}