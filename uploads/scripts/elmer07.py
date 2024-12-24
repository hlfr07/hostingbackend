import os
import subprocess
import signal
import sys

# Ruta del proyecto y comando a ejecutar
project_dir = r"C:\Users\LENOVO\Documents\PROYECTO_HOSTING_CPNEL\hosting_backend\uploads\elmer07\NODEJS-SINTAXIS-INSANA-main"
command = "npm start"

process = None

def signal_handler(sig, frame):
    global process
    print("\nRecibida señal de interrupción. Terminando el proceso...")
    if process:
        process.terminate()
        process.wait()
        print("Proceso terminado.")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

try:
    os.chdir(project_dir)
    print(f"Directorio del proyecto: {project_dir}")
    print(f"Ejecutando el comando: {command}")

    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    while True:
        output = process.stdout.readline()
        if output:
            print(output.strip())
        elif process.poll() is not None:
            break

    for error in process.stderr:
        print(error.strip())

except Exception as e:
    print(f"Error inesperado: {str(e)}")
finally:
    if process and process.poll() is None:
        process.terminate()
        print("Proceso hijo terminado.")