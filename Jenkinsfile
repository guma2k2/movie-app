pipeline {
    agent any
    
    tools {
        maven 'my-maven' 
    }

    environment {
        DOCKER_IMAGE_BACKEND = 'thuanvn2002/movie-backend'
        DOCKER_IMAGE_FRONTEND = 'thuanvn2002/movie-frontend'
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
    }

    stages {

        stage('Build Backend and Frontend') {
            steps {
                dir('back-end') {
                    sh 'mvn clean install -DskipTests'
                }
                
                dir('front-end') { // Ensure we are inside front-end directory
                    sh 'mvn clean install -DskipTests'  // Change to npm build if necessary
                }
            }
        }

        stage('Packaging/Pushing Image') {
            steps {
                script {
                    dir('back-end') {  // Ensure we are inside back-end directory
                        withDockerRegistry(credentialsId: 'dockerhub', url: DOCKER_REGISTRY) {
                            sh "docker build -t ${DOCKER_IMAGE_BACKEND} ."
                            sh "docker push ${DOCKER_IMAGE_BACKEND}"
                        }
                    }

                    dir('front-end') {  // Ensure we are inside front-end directory
                        withDockerRegistry(credentialsId: 'dockerhub', url: DOCKER_REGISTRY) {
                            sh "docker build -t ${DOCKER_IMAGE_FRONTEND} ."
                            sh "docker push ${DOCKER_IMAGE_FRONTEND}"
                        }
                    }
                }
            }
        }

        stage('Deploy Spring Boot to Production') {
            steps {
                sshagent(credentials: ['ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@10.251.2.81 << 'EOF'
ls
cd Documents/workspace/java-project/movie-app
git pull
docker compose up -d --build
EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
