class Main {
  constructor() {
    this.elements = {};
    this.init();
  }

  init() {
    this.gatherDOMReferences();
    this.sendRequest();
    this.loadParticipants(); // Загружаем участников при загрузке страницы
  }

  gatherDOMReferences() {
    this.elements.fullNameInput = document.getElementById("fullName");
    this.elements.universityInput = document.getElementById("university");
    this.elements.emailInput = document.getElementById("email");
    this.elements.teamNameInput = document.getElementById("teamName");
    this.elements.formRegister = document.getElementById("form");
    this.elements.tableBody = document.getElementById("participantsTableBody"); // tbody таблицы
  }

  // Загрузка участников из БД
  loadParticipants() {
    fetch("/api/get_participants.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.renderTable(data.data);
        } else {
          console.error("Ошибка:", data.error);
          this.showError("Не удалось загрузить данные");
        }
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        this.showError("Ошибка подключения к серверу");
      });
  }

  // Отображение таблицы с участниками
  renderTable(participants) {
    if (!this.elements.tableBody) return;

    // Очищаем таблицу
    this.elements.tableBody.innerHTML = "";

    if (participants.length === 0) {
      // Если нет данных, показываем пустую строку
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="6" style="text-align: center;">Нет зарегистрированных участников</td>`;
      this.elements.tableBody.appendChild(emptyRow);
      return;
    }

    // Создаём строки для каждого участника
    participants.forEach((participant) => {
      const row = document.createElement("tr");

      // Создаём ячейки
      const idCell = document.createElement("td");
      idCell.textContent = participant.id;

      const nameCell = document.createElement("td");
      nameCell.textContent = participant.full_name;

      const universityCell = document.createElement("td");
      universityCell.textContent = participant.university;

      const emailCell = document.createElement("td");
      emailCell.textContent = participant.email;

      const teamCell = document.createElement("td");
      teamCell.textContent = participant.team_name;

      const dateCell = document.createElement("td");
      dateCell.textContent = participant.created_at
        ? participant.created_at.replace(" ", "\n")
        : "-";

      // Добавляем ячейки в строку
      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(universityCell);
      row.appendChild(emailCell);
      row.appendChild(teamCell);
      row.appendChild(dateCell);

      // Добавляем строку в таблицу
      this.elements.tableBody.appendChild(row);
    });
  }

  // Отправка формы регистрации
  sendRequest() {
    if (!this.elements.formRegister) return;

    this.elements.formRegister.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        full_name: this.elements.fullNameInput?.value || "",
        university: this.elements.universityInput?.value || "",
        email: this.elements.emailInput?.value || "",
        team_name: this.elements.teamNameInput?.value || "",
      };

      // Валидация
      if (
        !formData.full_name ||
        !formData.university ||
        !formData.email ||
        !formData.team_name
      ) {
        alert("❌ Заполните все поля");
        return;
      }

      fetch("/api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("✅ " + data.message);
            this.elements.formRegister.reset();
            this.loadParticipants(); // Обновляем таблицу после добавления
          } else {
            alert("❌ " + data.error);
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("❌ Ошибка подключения к серверу");
        });
    });
  }

  // Показать ошибку
  showError(message) {
    if (this.elements.tableBody) {
      this.elements.tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">${message}</td></tr>`;
    }
  }
}

// Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const main = new Main();
});
