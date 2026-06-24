// URL da sua API no Railway
const API_URL = "https://web-production-ebc28.up.railway.app";

// Elementos das Páginas
const loginPage = document.getElementById('login-page');
const mainDashboard = document.getElementById('main-dashboard');
const loginForm = document.getElementById('login-form');
const contentArea = document.getElementById('content-area');

// Verificar se o usuário já estava logado antes
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('zetris_token');
    if (token) {
        showDashboard();
    }
});

// Evento de Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Criar o formato form-data exigido pelo OAuth2 no FastAPI Backend
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('E-mail ou senha incorretos.');
            }
            
            const data = await response.json();
            // Salvar o token de acesso no navegador
            localStorage.setItem('zetris_token', data.access_token);
            
            showDashboard();
        } catch (error) {
            alert(error.message);
        }
    });
}

// Mostrar o Painel
function showDashboard() {
    loginPage.classList.add('hidden');
    mainDashboard.classList.remove('hidden');
    switchTab('dashboard');
}

// Alternar Abas do Menu Lateral
function switchTab(tab) {
    if (tab === 'dashboard') {
        contentArea.innerHTML = `
            <h1 class="text-3xl font-black mb-2">Resumo Geral</h1>
            <p class="text-gray-400 mb-8">Estatísticas em tempo real do ecossistema Zetris.</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <p class="text-xs uppercase tracking-wider font-semibold text-gray-400">Clientes Ativos</p>
                    <p class="text-4xl font-black mt-2 text-blue-500">Loading...</p>
                </div>
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <p class="text-xs uppercase tracking-wider font-semibold text-gray-400">Total Produtos</p>
                    <p class="text-4xl font-black mt-2 text-purple-500">Loading...</p>
                </div>
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <p class="text-xs uppercase tracking-wider font-semibold text-gray-400">Vendas Realizadas</p>
                    <p class="text-4xl font-black mt-2 text-green-500">Loading...</p>
                </div>
            </div>
        `;
    } else {
        contentArea.innerHTML = `
            <h1 class="text-3xl font-black capitalize mb-2">${tab}</h1>
            <p class="text-gray-400">Área de gerenciamento de ${tab}. Conectando com as rotas do backend...</p>
        `;
    }
}

// Sair do Sistema
function logout() {
    localStorage.removeItem('zetris_token');
    mainDashboard.classList.add('hidden');
    loginPage.classList.remove('hidden');
    if (loginForm) loginForm.reset();
}
