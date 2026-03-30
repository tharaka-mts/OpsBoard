FROM jenkins/jenkins:lts

USER root

# Install prerequisites
RUN apt-get clean && rm -rf /var/lib/apt/lists/* && apt-get update && apt-get install -y --fix-missing \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    wget \
    unzip \
    awscli \
    lsb-release

# Install Maven
RUN wget -q https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz && \
    tar xzf apache-maven-3.9.9-bin.tar.gz -C /opt/ && \
    ln -s /opt/apache-maven-3.9.9 /opt/maven && \
    ln -s /opt/maven/bin/mvn /usr/local/bin/mvn && \
    rm apache-maven-3.9.9-bin.tar.gz

# Install Docker CLI
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/trusted.gpg.d/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list && \
    apt-get update && apt-get install -y docker-ce-cli

# Install Node.js & npm and Yarn
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn

# Install Trivy
RUN wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | tee /usr/share/keyrings/trivy.gpg > /dev/null && \
    echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" | tee -a /etc/apt/sources.list.d/trivy.list && \
    apt-get update && apt-get install -y trivy

# Install Sonar-Scanner CLI (Any architecture - Java version)
RUN wget -q https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-6.2.1.4610.zip && \
    unzip -q sonar-scanner-cli-6.2.1.4610.zip -d /opt/ && \
    rm sonar-scanner-cli-6.2.1.4610.zip && \
    ln -s /opt/sonar-scanner-6.2.1.4610/bin/sonar-scanner /usr/local/bin/sonar-scanner

# Install OWASP Dependency-Check (latest version)
RUN wget -q https://github.com/jeremylong/DependencyCheck/releases/download/v12.1.0/dependency-check-12.1.0-release.zip && \
    unzip -q dependency-check-12.1.0-release.zip -d /opt/ && \
    rm dependency-check-12.1.0-release.zip && \
    ln -s /opt/dependency-check/bin/dependency-check.sh /usr/local/bin/dependency-check.sh

# Install plugins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt

# Create docker group with common GID to avoid permission issues when mapping socket
# We will use the 'docker' binary installed from the cli package which requires permissions
# Actually, mapping the socket will map it as root. We give jenkins sudo without password for docker, or add to root.
# A simpler approach locally is to add the jenkins user to the root group or give access to socket.
RUN usermod -aG root jenkins

USER jenkins
