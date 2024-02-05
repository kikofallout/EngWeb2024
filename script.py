import os

# Create the folders
for i in range(1, 9):
    folder_name = f"TPC{i}"
    os.makedirs(folder_name)
    open(f"{folder_name}/.gitkeep", "w").close()

os.mkdir("Projeto")
open("Projeto/.gitkeep", "w").close()
os.mkdir("Teste")
open("Teste/.gitkeep", "w").close()
    
    
