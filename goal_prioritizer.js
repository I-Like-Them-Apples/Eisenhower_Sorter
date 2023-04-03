document.addEventListener("DOMContentLoaded", function() {
    const goalInputField = document.getElementById("goal-input");
    const loadGoalsBtn = document.getElementById("load-goals-button");
    const goalList = document.getElementById("goal-list");
    const urgentImportant = document.getElementById("urgent-important");
    const urgentNotImportant = document.getElementById("urgent-not-important");
    const notUrgentImportant = document.getElementById("not-urgent-important");
    const notUrgentNotImportant = document.getElementById("not-urgent-not-important");
    const prioritizeGoalsBtn = document.getElementById("prioritize-goals-button");
    const prioritizedGoalsOutput = document.getElementById("prioritized-goals");
    const clearDataBtn = document.getElementById("clear-data-button");
    const copyToClipboardBtn = document.getElementById("copy-to-clipboard-button");
    const viewContainer = document.getElementById("view-container");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    let currentViewIndex = 0;
    var goalInput = document.getElementById("goal-input");
    goalInput.style.width = "75%";
    goalInput.style.height = "200px";
    var goalInput = document.getElementById("prioritized-goals");
    goalInput.style.width = "75%";
    goalInput.style.height = "200px";

    function navigateToView(viewIndex) {
        if (viewIndex < 0 || viewIndex >= 5) return;
        currentViewIndex = viewIndex;
        const views = document.querySelectorAll(".view");
        views.forEach((view, index) => {
            if (index === viewIndex) {
                view.style.display = "flex";
            } else {
                view.style.display = "none";
            }
        });
    }


    prevButton.addEventListener("click", function() {
        navigateToView(currentViewIndex - 1);
    });

    nextButton.addEventListener("click", function() {
        navigateToView(currentViewIndex + 1);
    });


    function copyToClipboard() {
        prioritizedGoalsOutput.select();
        prioritizedGoalsOutput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand("copy");
    }

    copyToClipboardBtn.addEventListener("click", copyToClipboard);


    function clearData() {
        localStorage.removeItem("goals");
        localStorage.removeItem("sortedState");
        goalInputField.value = "";
        prioritizedGoalsOutput.value = "";
        urgentImportant.innerHTML = "";
        urgentNotImportant.innerHTML = "";
        notUrgentImportant.innerHTML = "";
        notUrgentNotImportant.innerHTML = "";
        autoResize(goalInputField);
        autoResize(prioritizedGoalsOutput);
    }
    clearDataBtn.addEventListener("click", clearData);


    function autoResize(element) {
        element.style.height = "20px";
        element.style.height = element.scrollHeight + "px";
    }

    goalInputField.addEventListener("input", () => autoResize(goalInputField));
    prioritizedGoalsOutput.addEventListener("input", () => autoResize(prioritizedGoalsOutput));

    function saveSortedState() {
        const sortedState = {
            urgentImportant: [...urgentImportant.children].map(goal => goal.textContent),
            urgentNotImportant: [...urgentNotImportant.children].map(goal => goal.textContent),
            notUrgentImportant: [...notUrgentImportant.children].map(goal => goal.textContent),
            notUrgentNotImportant: [...notUrgentNotImportant.children].map(goal => goal.textContent)
        };
        localStorage.setItem('sortedState', JSON.stringify(sortedState));
    }

    function loadSortedState() {
        const sortedStateJSON = localStorage.getItem('sortedState');

        if (sortedStateJSON) {
            const sortedState = JSON.parse(sortedStateJSON);

            for (const goal of sortedState.urgentImportant) {
                addGoalToCell(goal, urgentImportant);
            }
            for (const goal of sortedState.urgentNotImportant) {
                addGoalToCell(goal, urgentNotImportant);
            }
            for (const goal of sortedState.notUrgentImportant) {
                addGoalToCell(goal, notUrgentImportant);
            }
            for (const goal of sortedState.notUrgentNotImportant) {
                addGoalToCell(goal, notUrgentNotImportant);
            }
        }
    }


    function saveGoals() {
        const goals = goalInputField.value;
        localStorage.setItem('goals', goals);
    }

    function loadGoalsFromStorage() {
        const goals = localStorage.getItem('goals') || '';
        goalInputField.value = goals;
    }

    goalInputField.addEventListener('input', saveGoals);
    loadGoalsFromStorage();

    function addGoalToTable(goalText, isImportant, isUrgent) {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
      <td>${goalText}</td>
      <td>
        <label>
          <input type="checkbox" class="important-checkbox" ${isImportant ? "checked" : ""}>
          Important
        </label>
      </td>
      <td>
        <label>
          <input type="checkbox" class="urgent-checkbox" ${isUrgent ? "checked" : ""}>
          Urgent
        </label>
      </td>
    `;
        goalList.getElementsByTagName("tbody")[0].appendChild(tableRow);
    }

    loadGoalsBtn.addEventListener("click", function() {
        goalList.innerHTML = "<thead><tr><th>Goal</th><th>Important</th><th>Urgent</th></tr></thead><tbody></tbody>";
        prioritizedGoalsOutput.value = "";
        const goals = goalInputField.value.split("\n").filter(goal => goal.trim());
        for (const goal of goals) {
            addGoalToTable(goal, false, false);
        }
        goalInputField.value = "";
        navigateToView(currentViewIndex + 1);
    });

    prioritizeGoalsBtn.addEventListener("click", function() {
        const goalTableRows = [...goalList.getElementsByTagName("tr")].slice(1);
        urgentImportant.innerHTML = "";
        urgentNotImportant.innerHTML = "";
        notUrgentImportant.innerHTML = "";
        notUrgentNotImportant.innerHTML = "";

        for (const goalRow of goalTableRows) {
            const goalText = goalRow.getElementsByTagName("td")[0].innerHTML;
            const isImportant = goalRow.getElementsByClassName("important-checkbox")[0].checked;
            const isUrgent = goalRow.getElementsByClassName("urgent-checkbox")[0].checked;

            if (isImportant && isUrgent) {
                addGoalToCell(goalText, urgentImportant);
            } else if (!isImportant && isUrgent) {
                addGoalToCell(goalText, urgentNotImportant);
            } else if (isImportant && !isUrgent) {
                addGoalToCell(goalText, notUrgentImportant);
            } else {
                addGoalToCell(goalText, notUrgentNotImportant);
            }
        }

        prioritizedGoalsOutput.value = [
            ...urgentImportant.children,
            ...notUrgentImportant.children,
            ...urgentNotImportant.children,
            ...notUrgentNotImportant.children
        ].map(goal => goal.textContent).join("\n");
        saveSortedState();
        navigateToView(currentViewIndex + 1);
    });

    function addGoalToCell(goalText, cell) {
        const goalElement = document.createElement("div");
        goalElement.textContent = goalText;
        cell.appendChild(goalElement);
    }

    // Add this line at the end of the script
    navigateToView(0);

    loadSortedState();
});
