const goalInput = document.getElementById("goal-input");
const loadGoalsButton = document.getElementById("load-goals-button");
const goalList = document.getElementById("goal-list");
const prioritizeGoalsButton = document.getElementById("prioritize-goals-button");
const prioritizedGoals = document.getElementById("prioritized-goals");

function addGoal(goal, important, urgent) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${goal}</td>
    <td>
      <label>
        <input type="checkbox" class="important-checkbox" ${important ? "checked" : ""}>
        Important
      </label>
    </td>
    <td>
      <label>
        <input type="checkbox" class="urgent-checkbox" ${urgent ? "checked" : ""}>
        Urgent
      </label>
    </td>
  `;
  goalList.appendChild(tr);
}

loadGoalsButton.addEventListener("click", function() {
  goalList.innerHTML = "";
  prioritizedGoals.value = "";
  const goals = goalInput.value.split("\n").filter(goal => goal);
  for (const goal of goals) {
    addGoal(goal, false, false);
  }
  goalInput.value = "";
});

prioritizeGoalsButton.addEventListener("click", function() {
  const goals = [...goalList.getElementsByTagName("tr")];
  goals.sort(function(a, b) {
    const aImportant = a.getElementsByClassName("important-checkbox")[0].checked;
    const bImportant = b.getElementsByClassName("important-checkbox")[0].checked;
    const aUrgent = a.getElementsByClassName("urgent-checkbox")[0].checked;
    const bUrgent = b.getElementsByClassName("urgent-checkbox")[0].checked;
    if (aImportant !== bImportant) {
      return bImportant - aImportant;
    }
    if (aUrgent !== bUrgent) {
      return bUrgent - aUrgent;
    }
    return a.innerHTML.localeCompare(b.innerHTML);
  });
  goalList.innerHTML = "";
  prioritizedGoals.value = "";
  for (const goal of goals) {
    goalList.appendChild(goal);
    prioritizedGoals.value += goal.getElementsByTagName("td")[0].innerHTML + "\n";
  }
});
