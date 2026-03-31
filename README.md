# 🚀 OpsBoard: End-to-End DevSecOps Platform on AWS EKS

![Architecture Diagram](docs/architecture/architecture.gif)

OpsBoard is a professional-grade, production-ready DevSecOps project demonstrating a full CI/CD lifecycle for a Spring Boot and React application deployed on Amazon EKS (Elastic Kubernetes Service).

---

## 🏗️ Tech Stack Teaser

- **GitHub (Code)**: Version Control and Repository Management.
- **Docker (Containerization)**: Consistent application environments.
- **Jenkins (CI)**: Centralized orchestration for the CI pipeline.
- **OWASP (Dependency Check)**: Software Composition Analysis (SCA) for vulnerability scanning.
- **SonarQube (Quality)**: Static Application Security Testing (SAST).
- **AWS ECR (Container Registry)**: Container image registry for storing and managing Docker images.
- **Trivy (Filesystem Scan)**: Deep container image and filesystem scanning.
- **ArgoCD (CD)**: GitOps-based Continuous Deployment to Kubernetes.
- **Redis (Caching)**: Integrated within ArgoCD for efficient state management.
- **AWS EKS (Kubernetes)**: Managed Kubernetes service for production workloads.
- **Helm (Monitoring & Management)**: Packaging and monitoring using Prometheus and Grafana.

---

## CI/CD Overview After Deployment

- **Jenkins Pipeline - Build, Test, Scan, Push & Update values.yaml**
![Pipeline](docs/screenshots/ci_pipeline_success.png)

- **ArgoCD - Deploy to EKS**
![ArgoCD](docs/screenshots/argocd_ui_sync.png)

- **Monitoring - Prometheus & Grafana**
![Grafana](docs/screenshots/grafana_dashboard.png)

---

## 🗺️ Quick Navigation

- [📋 Phase 1: Prerequisites & Keys](#phase-1-prerequisites--keys)
- [🛠️ Phase 2: Infrastructure Provisioning (Terraform)](#phase-2-infrastructure-provisioning-terraform)
- [🔄 Phase 3: Jenkins Controller Setup (CI Part 1)](#phase-3-jenkins-controller-setup-ci-part-1)
- [🧪 Phase 4: Jenkins Agent & CI Flow (CI Part 2)](#phase-4-jenkins-agent--ci-flow-ci-part-2)
- [🚢 Phase 5: EKS & CD Setup (ArgoCD Part 1)](#phase-5-eks--cd-setup-argocd-part-1)
- [📊 Phase 6: Monitoring & Final Sync (CD Part 2)](#phase-6-monitoring--final-sync-cd-part-2)
- [✅ Deployment Verification](#deployment-verification)

---

## 📋 Phase 1: Prerequisites & Keys

Before starting, prepare all the necessary tokens and keys that will be used across the project. Make sure to save them in a secure place with quick access so you can use them when needed. In real-world scenarios, you should use a secrets manager to store these secrets.

### 1.1 IAM Tokens & Keys
| Key Name | Purpose |
| :--- | :--- |
| `opsboard-ssh-key` | AWS EC2 Key Pair for SSH access (.pem). |
| `github-credentials` | GitHub Personal Access Token (PAT) for repo access. |
| `slack-token` | Used for receiving real-time build and deployment alerts. |
| `nvd-api-key` | Used for OWASP Dependency-Check to fetch vulnerability data. |
| `sonar-token` | Used to authenticate Jenkins with SonarQube. |

### 1.2 Generate SSH Key (opsboard-ssh-key)
1. Go to **AWS Console -> EC2 -> Key Pairs**.
![Navigate to EC2 Key Pairs](docs/screenshots/navigate_to_ec2_key_pairs.png)
2. Create an RSA Key Pair named **`opsboard-ssh-key.pem`**.
![Generate SSH Key](docs/screenshots/generate_ssh_key.png)
3. Move the downloaded file to your local `terraform/` directory.

### 1.3 GitHub Personal Access Token ( github-credentials )
1. Go to **GitHub -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic)**.
![GitHub Personal Access Token](docs/screenshots/github_personal_access_token-1.png)
![GitHub Personal Access Token](docs/screenshots/github_personal_access_token-2.png)

2. **Pick a name and select repository access** (This shows classic tokens; if you are using fine-grained tokens, select repository access).
![GitHub Personal Access Token](docs/screenshots/github_personal_access_token-3.png)

3. **Copy the token**
![GitHub Personal Access Token](docs/screenshots/github_personal_access_token-4.png)

### 1.4 Slack Token
1. Go to **Slack App -> More -> Tools -> Apps -> Search Jenkins CI**.
![Slack Token](docs/screenshots/slack_token-1.png)
2. Click on **Add to Slack -> Open configuration browser window -> Select channel or create new channel -> copy the token**.
![Slack Token](docs/screenshots/slack_token-2.png)

### 1.5 NVD API Key
1. Go to **NVD -> Register**.
```bash
https://nvd.nist.gov/developers/request-an-api-key
```
2. Fill the form and get the verification email.
3. Click on the verification link in the email to get the API key
![NVD API Key](docs/screenshots/nvd_api_key-1.png)
![NVD API Key](docs/screenshots/nvd_api_key-2.png)

**Alternatively, use the one below:**
```bash
4919dea7-2b9e-4169-a881-214c187b38be
```
### 1.6 SonarQube Token (sonar-token)[add a link here to SonarQube Token creation process below, after ec2 spin and docker compose up]


---

## 🛠️ Phase 2: Infrastructure Provisioning (Terraform)

### 2.1 Initial Provisioning (Without EKS)
To save time and costs during the CI setup, we first provision only the CI environment.
1. Copy `terraform.tfvars.example` to **`terraform/terraform.tfvars`** and ensure `create_eks = false`.
2. Run the following:

```bash
cd terraform
terraform init
terraform plan
```

![Terraform Applying Status](docs/screenshots/terraform_init_apply-1.png)
![Terraform Applying Status](docs/screenshots/terraform_init_apply-2.png)

```bash
terraform apply -auto-approve
```
![Terraform Applying Status](docs/screenshots/terraform_init_apply-3.png)

### 2.2 Get Public IP
Open the `deploy.instructions.md` file or any preferred text editor.
Copy the Terraform output to the file for future reference.
Note the **Jenkins Controller's Public IP** from the Terraform output or the AWS Console.

---

## 🔄 Phase 3: Jenkins Controller Setup (CI Part 1)

### 3.1 Bootstrap CI Environment
Connect to your Jenkins Controller via SSH and start the environment.

```bash
# Log in to Jenkins Controller
ssh -i "opsboard-ssh-key.pem" ubuntu@<YOUR_JENKINS_CONTROLLER_IP>

# Clone the repository
git clone https://github.com/your-username/OpsBoard.git
cd OpsBoard/workflow/ci

# Start Jenkins and SonarQube using Docker Compose
docker-compose up -d
```
**This will start Jenkins and SonarQube in the Jenkins Controller EC2 instance.**
![Docker Compose](docs/screenshots/docker_compose.png)

### 3.2 Jenkins Initialization
1. Access the Jenkins UI using the **Jenkins Controller's Public IP**.
    ```bash
    http://<JENKINS_CONTROLLER_PUBLIC_IP>:8080
    ```
    ![Jenkins UI](docs/screenshots/jenkins_ui.png)

2. **To get the Admin Password, run the following command on the Jenkins Controller**:  
    ```bash
    docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
    ```
    ![Jenkins Admin Password](docs/screenshots/jenkins_admin_password.png)
3.  **Generate SonarQube Token**:
    Log in to SonarQube (Default admin:admin), go to **Security -> Tokens**, and generate a new token.
    ```bash
    http://<JENKINS_CONTROLLER_PUBLIC_IP>:9000
    ```    
    ![SonarQube Token](docs/screenshots/sonarqube_token-1.png)
    ![SonarQube Token](docs/screenshots/sonarqube_token-2.png)
    ![SonarQube Token](docs/screenshots/sonarqube_token-3.png)

 **Add the webhook to SonarQube (Admin -> Configuration -> Webhooks)**:
```bash
http://<JENKINS_CONTROLLER_PRIVATE_IP>:8080/sonarqube-webhook/
```
![SonarQube Webhook](docs/screenshots/sonarqube_webhook.png)

> Make sure to use the same name for the credentials as mentioned in the below table.
4.  **Credential Setup**: Add the following credentials to Jenkins (**Dashboard -> Manage Jenkins -> Credentials**):
    - `opsboard-ssh-key` (SSH Username with Private Key)
    Copy the private key from the `terraform/opsboard-ssh-key.pem` file.
    ```
    cat terraform/opsboard-ssh-key.pem
    ```
    ![ssh key](docs/screenshots/ssh_key.png)
    ![opsboard-ssh-key](docs/screenshots/opsboard-ssh-key.png)
    - `github-credentials` (Username with Password)
    ![github-credentials](docs/screenshots/github-credentials.png)
    - `slack-token` (Text)
    - `sonar-token` (Text)
    - `nvd-api-key` (Text)
    ![text_credentials](docs/screenshots/text_credentials.png)

### 3.3 Plugin Configuration
Install the **SonarQube Quality Gate** plugins from **Manage Jenkins -> Plugins**.
![Plugin Installation](docs/screenshots/plugin_installation.png)

### 3.4 SonarQube Server Configuration & Slack Configuration
1. Go to **Manage Jenkins -> Configure System**.
2. Scroll down to **SonarQube servers** and click on **Add SonarQube**.
![SonarQube Server Configuration](docs/screenshots/sonarqube_server_configuration.png)

3. Scroll down to **Slack** and enter the **slack configurations**.
![Slack Configuration](docs/screenshots/slack_configuration.png)

---

## 🧪 Phase 4: Jenkins Agent & CI Flow (CI Part 2)

### 4.1 Connect Jenkins Agent
Add the **Jenkins Agent EC2** (created by Terraform) to the node inventory:
1. Go to **Manage Jenkins -> Nodes**.
2. Click on **New Node**.
![Jenkins Agent](docs/screenshots/jenkins_agent-1.png)
![Jenkins Agent](docs/screenshots/jenkins_agent-2.png)
![Jenkins Agent](docs/screenshots/jenkins_agent-3.png)
3. Use the **Public IP** of the Agent EC2 and connect via SSH using the `opsboard-ssh-key`.
```bash
ssh -i "opsboard-ssh-key.pem" ubuntu@<JENKINS_AGENT_PUBLIC_IP>
```

### 4.2 Verify Agent Environment
Log in to the Agent EC2 to ensure all dependencies are pre-installed by the Terraform bootstrap script:
```bash
docker --version
node --version
yarn --version
java --version
```

### 4.3 Configure Jenkins CI Pipeline
1. Go to **Jenkins -> New Item**.
![Jenkins New Item](docs/screenshots/jenkins_new_item.png)
2. Click on **Pipeline & add Details**.
![Jenkins Pipeline](docs/screenshots/jenkins_pipeline-1.png)
![Jenkins Pipeline](docs/screenshots/jenkins_pipeline-2.png)
3. Click on **Save**.
![Jenkins Pipeline](docs/screenshots/jenkins_pipeline-3.png)


### 4.4 Run CI Pipeline
Run the pipeline by clicking on **Build Now**.
*Note: The first run takes several minutes to download the OWASP vulnerability database.*

![Pipeline Workflow](docs/screenshots/ci_pipeline_success.png)

**Check Slack for the pipeline status**
![Slack Notification](docs/screenshots/slack_notification.png)

**Check and confirm the ECR for the new images**
![ECR Images](docs/screenshots/ecr_images-1.png)
![ECR Images](docs/screenshots/ecr_images-2.png)

---

## 🚢 Phase 5: EKS & CD Setup (ArgoCD Part 1)

### 5.1 Final Infrastructure Apply
Now, enable the EKS cluster in Terraform.
1. Open **`terraform/terraform.tfvars`** and set `create_eks = true`.
2. Apply the changes:
```bash
cd terraform
terraform plan
terraform apply -auto-approve
```
*(Takes 10-30 minutes for EKS provisioning)*

![Terraform Plan](docs/screenshots/terraform_plan.png)
![Terraform Apply](docs/screenshots/terraform_apply.png)

### 5.2 Grant EKS Permissions & Verify
Ensure the **Jenkins Agent EC2 IAM Role** has the required permissions to manage the EKS cluster. Since we enabled the EKS Access API, this is now automated via Terraform. 

Connect to the Agent EC2 via SSH and update the kubeconfig:
```bash
aws eks update-kubeconfig --region us-east-1 --name opsboard-cluster
```
![Kubeconfig](docs/screenshots/aws_eks_update_kubeconfig.png)
---

## 🚢 Phase 5.3: Deploy & Expose ArgoCD

### 5.3.1 Install ArgoCD
Run the following commands on the agent to install ArgoCD:
```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
helm repo add argo https://argoproj.github.io/argo-helm
helm install argo-cd argo/argo-cd -n argocd

```
![ArgoCD Install](docs/screenshots/argocd_install-1.png)
![ArgoCD Install](docs/screenshots/argocd_install-2.png)

### 5.3.2 Get Initial Admin Password
ArgoCD creates a default admin password stored in a K8s secret:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```
![ArgoCD Password](docs/screenshots/argocd_password.png)

### 5.3.3 Expose ArgoCD via ALB
To access the ArgoCD UI from your browser, expose it using an Ingress or change the Service type to LoadBalancer:
```bash
# Set service type to LoadBalancer for quick access
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Get the Public URL (DNS Name)
kubectl get svc argocd-server -n argocd
```
![ArgoCD Service ALB](docs/screenshots/argocd_svc_alb.png)

---

## 🚢 Phase 5.4: ArgoCD Application Configuration

### 5.4.1 Connect GitHub Repository
1. Log in to the ArgoCD UI using the ALB DNS name.
![ArgoCD Login](docs/screenshots/argocd_login-1.png)
![ArgoCD Login](docs/screenshots/argocd_login-2.png)
2. Go to **Settings -> Repositories -> Connect Repo**.
3. Add your HTTPS GitHub URL and credentials.
![ArgoCD Repo Connect](docs/screenshots/argocd_repo_connect.png)

### 5.4.2 Create the OpsBoard Application
Create a new App with the following details:
- **Application Name**: `opsboard-app`
- **Project**: `default`
- **Sync Policy**: `Manual` (or Automatic for true GitOps)
- **Repository URL**: Your GitHub Repo
- **Path**: `helm/`
- **Cluster URL**: `https://kubernetes.default.svc`
- **Namespace**: `opsboard-prod`

![ArgoCD App Creation](docs/screenshots/argocd_app_creation-1.png)
![ArgoCD App Creation](docs/screenshots/argocd_app_creation-2.png)
![ArgoCD App Creation](docs/screenshots/argocd_app_creation-3.png)


### 5.4.3 Configure Parameters
In the **Parameters** section of the App, check & update the following values:
- `db_name`: opsboard
- `db_user`: opsboarduser
- `db_password`: Your secure DB password.
- `slack_token`: Your Slack Bot token.

![ArgoCD App Creation](docs/screenshots/argocd_app_creation-4.png)
![ArgoCD App Creation](docs/screenshots/argocd_app_creation-5.png)

---

## 📊 Phase 6: Monitoring & Final Sync

### 6.1 Sync and Deploy
Click the **Sync** button in ArgoCD to start the deployment. ArgoCD will provision the Backend, Frontend, and Postgres pods.
![ArgoCD Sync Status](docs/screenshots/argocd_ui_sync.png)

### 6.2 Expose the Application (Access the App)
Get the **Public URL** for the OpsBoard application itself:
```bash
# Check the ingress to find the ALB DNS name
kubectl get ingress opsboard-prod -n opsboard-prod
```
![App Ingress ALB](docs/screenshots/app_ingress_alb.png)

### 6.3 Deploy Monitoring Stack (Manual Step)
Deploy Prometheus and Grafana for real-time visibility:
```bash
cd monitoring
# Install using Helm
helm install monitoring prometheus-community/kube-prometheus-stack -f prometheus-values.yaml
```
![Grafana Dashboard](docs/screenshots/grafana_dashboard.png)

---

## ✅ Deployment Verification & Final Checks

1. **Slack Notifications**: Verify that ArgoCD and Jenkins have sent success messages to your Slack channel.
2. **Postgres Check**: Log into the Postgres pod and confirm the `work_items` table is initialized:
   ```bash
   kubectl exec -it <postgres-pod-name> -n opsboard-prod -- psql -U opsboarduser -d opsboard -c "\dt"
   ```
3. **Frontend Access**: Open the Ingress URL in your browser and try to create a new Work Item.

![Final App Dashboard](docs/screenshots/app_final_dashboard-1.png)
![Final App Dashboard](docs/screenshots/app_final_dashboard-2.png)

---

## 🧹 Cleanup
To avoid AWS costs, destroy the infrastructure when finished:
1. **Delete the ArgoCD App** (removes K8s resources).
2. **Terraform Destroy**:
```bash
cd terraform
terraform destroy -auto-approve
```

---

*OpsBoard Deployment Documentation - 2026*
