from storage import *

check_and_replan_if_needed()

print("Agent Actions:")
print(load_state()["agent_actions"])
