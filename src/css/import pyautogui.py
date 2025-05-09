import pyautogui
import time

def auto_click(delay=0.1, duration=5):
    """
    Auto click toutes les `delay` secondes pendant `duration` secondes.
    """
    print(f"Lancement de l'auto-click pendant {duration} secondes (Ctrl+C pour arrêter)...")
    start_time = time.time()
    try:
        while time.time() - start_time < duration:
            pyautogui.click()
            time.sleep(delay)
    except KeyboardInterrupt:
        print("Arrêt manuel.")
    print("Auto-click terminé.")

# Exemple d'utilisation :
auto_click(delay=0.1, duration=10)  # Clique toutes les 0.1 secondes pendant 10 secondes
