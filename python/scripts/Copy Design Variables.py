"""
Copy Design Variables

Description:
    Copy local variables in the current design into clipboard.
    Only works on Windows.
"""

import os
import ScriptEnv


oProject = oDesktop.GetActiveProject()
oDesign = oProject.GetActiveDesign()
oDesignVariables = oDesign.GetChildObject("Variables")
variables = oDesign.GetVariables()

project_name = oProject.GetName()
design_name = oDesign.GetName()


def log(msg):
    oDesktop.AddMessage(project_name, design_name, 0, msg, "User Toolkit")


variables_dict = {}

for var in variables:
    variables_dict.update({var: oDesign.GetVariableValue(var)})

log("Exporting design variables:")
log(str(variables_dict))

os.system("echo " + str(variables_dict).strip() + " | clip")

log("Design variables has been copied to clipboard.")
