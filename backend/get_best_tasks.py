from distance import get_distance
def find_best_tasks(TASKS, user):
    best_tasks = []
    for task in TASKS:
        if(get_distance(user["latitude"], user["longitude"], task["latitude"], 
                        task["longitude"]) <= user["distance"]):
            if(task["category"] in user["skills"]):
                best_tasks.append(task)
    return best_tasks