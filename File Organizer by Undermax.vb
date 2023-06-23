Imports System.IO
Imports System.IO.Compression
Imports System.IO.Compression.ZipFile
Imports System.Text
Imports System.IO.File
Imports System.Text.RegularExpressions

Public Class Form1

    Private Sub LostButton1_Click(sender As Object, e As EventArgs) Handles LostButton1.Click
        Dim zipPaths As String() = RutaArchivoBox.Text.Split(";"c)
        Dim extractPath As String = RutaCarpetaBox.Text

        For Each zipPath In zipPaths
            ' Extraer el nombre del archivo de la ruta
            Dim zipFileName As String = Path.GetFileNameWithoutExtension(zipPath)

            If String.IsNullOrEmpty(zipPath) Or String.IsNullOrEmpty(zipFileName) Or String.IsNullOrEmpty(TypeSelector.Text) Or (TypeSelector.Text = "Special Skin" And String.IsNullOrEmpty(SpecialSelectorNumber.Text)) Then
                MessageBox.Show("Por favor, completa todos los campos requeridos.")
                Return
            End If

            ' Establecer el nombre del personaje a partir del nombre del archivo
            Dim characterName As String = zipFileName
            Dim tempPath As String = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName())
            Dim characterType As String = TypeSelector.Text
            Dim specialNumber As String = ""
            Dim category As String = If(CategoriaCombo.SelectedIndex = 0, "Playable", "NoPlayable")

            If String.IsNullOrEmpty(extractPath) Or extractPath = "Automática (Misma ruta del archivo zip)" Then
                extractPath = Path.GetDirectoryName(zipPath)
            End If

            If characterType = "Special Skin" Then
                specialNumber = SpecialSelectorNumber.Text
            End If

            ZipFile.ExtractToDirectory(zipPath, tempPath)

            For Each file In Directory.GetFiles(tempPath)
                Dim fileName As String = Path.GetFileNameWithoutExtension(file)
                Dim extension As String = Path.GetExtension(file)
                Dim destinationFolder As String = ""

                If fileName.Contains("sheet") Or fileName.Contains("down") Then
                    fileName += If(fileName.Contains("sheet"), "[VS8]", "")
                    destinationFolder = Path.Combine(extractPath, "characters", category, characterName, characterType)
                ElseIf fileName.Contains("face") And CategoriaCombo.SelectedIndex <> 1 Then
                    destinationFolder = Path.Combine(extractPath, "faces", "Characters", characterName, characterType)
                ElseIf fileName.Contains("battler") And CategoriaCombo.SelectedIndex <> 1 Then
                    destinationFolder = Path.Combine(extractPath, "sv_actors", "Characters", characterName, characterType)
                ElseIf fileName.Contains("bust") And CategoriaCombo.SelectedIndex <> 1 Then
                    destinationFolder = Path.Combine(extractPath, "pictures", "Characters", characterName, characterType)
                End If

                If characterType = "Special Skin" Then
                    destinationFolder = Path.Combine(destinationFolder, specialNumber)
                End If

                If String.IsNullOrEmpty(destinationFolder) Then
                    Continue For
                End If

                Directory.CreateDirectory(destinationFolder)

                Dim destinationPath As String
                If fileName.Contains("down") Then
                    destinationPath = Path.Combine(destinationFolder, "$" + fileName + extension)
                Else
                    destinationPath = Path.Combine(destinationFolder, fileName + extension)
                End If

                If System.IO.File.Exists(destinationPath) Then
                    System.IO.File.Delete(destinationPath)
                End If

                System.IO.File.Move(file, destinationPath)
            Next

            Directory.Delete(tempPath, True)
        Next

        MessageBox.Show("Extracción correcta.")
        SpecialSelectorNumber.Visible = False
        LabelNumeroSkin.Visible = False

        Process.Start("explorer.exe", extractPath)

        RutaArchivoBox.Clear()
        RutaCarpetaBox.Clear()
        NombrePersonaje.ResetText()
        TypeSelector.SelectedIndex = -1
        SpecialSelectorNumber.SelectedIndex = -1
    End Sub






    Private Function GetCharacterNameFromFileName(fileName As String) As String
        Dim characterIndex = fileName.IndexOf("("c)

        If characterIndex <> -1 Then
            Dim characterName = fileName.Substring(0, characterIndex)
            characterName = Char.ToUpper(characterName(0)) + characterName.Substring(1) ' Hace la primera letra en mayúscula
            Return characterName
        Else
            Return Nothing
        End If
    End Function

    Private Function GetSkinTypeFromFileName(fileName As String) As String
        Dim match = Regex.Match(fileName, "(base|special|skin)", RegexOptions.IgnoreCase)
        If match.Success Then
            Return match.Value
        Else
            Return Nothing
        End If
    End Function

    Private Function GetSkinNumberFromFileName(fileName As String) As Integer
        Dim match = Regex.Match(fileName, "\d+")
        If match.Success Then
            Return Integer.Parse(match.Value)
        Else
            Return 1
        End If
    End Function

    Private Sub SetTypeSelector(type As String)
        If type Is Nothing Then
            ' Podrías manejar el caso en que type sea Nothing aquí.
        Else
            type = type.ToLower()
            If type = "base" Then
                TypeSelector.SelectedIndex = 0
                SpecialSelectorNumber.Enabled = False
                SpecialSelectorNumber.Visible = False
                LabelNumeroSkin.Visible = False
            ElseIf type = "special" Or type = "skin" Then
                TypeSelector.SelectedIndex = 1
                SpecialSelectorNumber.Enabled = True
                SpecialSelectorNumber.Visible = True
                LabelNumeroSkin.Visible = True
            End If
        End If
    End Sub


    Private Sub SetSkinNumberSelector(number As Integer)
        If number >= 1 And number <= SpecialSelectorNumber.Items.Count Then
            SpecialSelectorNumber.SelectedIndex = number - 1
        Else
            SpecialSelectorNumber.SelectedIndex = 0
        End If
    End Sub


    Private Sub SetSpecialSelectorNumber(number As Integer)
        If number <= SpecialSelectorNumber.Items.Count Then
            SpecialSelectorNumber.SelectedIndex = number - 1
        End If
    End Sub

    Private Function GetUniqueFolderPath(basePath As String, baseFolderName As String) As String
        Dim counter As Integer = 1
        Dim folderName As String = baseFolderName

        While Directory.Exists(Path.Combine(basePath, folderName))
            folderName = baseFolderName & " " & counter.ToString()
            counter += 1
        End While

        Return Path.Combine(basePath, folderName)
    End Function

    Private Sub LostButton2_Click(sender As Object, e As EventArgs) Handles LostButton2.Click
        Dim openFileDialog As New OpenFileDialog()
        openFileDialog.Filter = "Archivos ZIP (*.zip)|*.zip"
        openFileDialog.Multiselect = True

        If openFileDialog.ShowDialog() = DialogResult.OK Then
            Dim rutaArchivo As String = String.Join(";", openFileDialog.FileNames)
            RutaArchivoBox.Text = rutaArchivo

            ' Obtiene el nombre del personaje, el tipo de piel y el número de piel del primer archivo seleccionado
            Dim nombreArchivo As String = Path.GetFileName(openFileDialog.FileNames(0))

            Dim characterName = GetCharacterNameFromFileName(nombreArchivo)
            If Not String.IsNullOrEmpty(characterName) Then
                NombrePersonaje.Text = characterName
            End If

            Dim skinType = GetSkinTypeFromFileName(nombreArchivo)
            If Not String.IsNullOrEmpty(skinType) Then
                SetTypeSelector(skinType)
            End If

            Dim skinNumber = GetSkinNumberFromFileName(nombreArchivo)
            SetSkinNumberSelector(skinNumber)
        End If
    End Sub

    Private Sub LostButton3_Click(sender As Object, e As EventArgs) Handles LostButton3.Click
        Dim folderBrowserDialog As New FolderBrowserDialog()

        If folderBrowserDialog.ShowDialog() = DialogResult.OK Then
            Dim rutaCarpeta As String = folderBrowserDialog.SelectedPath
            RutaCarpetaBox.Text = rutaCarpeta
        End If
    End Sub

    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        Me.AllowDrop = True
        CategoriaCombo.SelectedIndex = 0
    End Sub

    Private Sub Form1_DragEnter(sender As Object, e As DragEventArgs) Handles MyBase.DragEnter
        If e.Data.GetDataPresent(DataFormats.FileDrop) Then
            e.Effect = DragDropEffects.Copy
        End If
    End Sub

    Private Sub Form1_DragDrop(sender As Object, e As DragEventArgs) Handles MyBase.DragDrop
        Dim files() As String = e.Data.GetData(DataFormats.FileDrop)
        If files.Length <> 0 Then
            Dim zipFiles = files.Where(Function(f) f.EndsWith(".zip")).ToArray()

            If zipFiles.Length <> 0 Then
                RutaArchivoBox.Text = String.Join(";", zipFiles)

                Dim characterName = GetCharacterNameFromFileName(Path.GetFileName(zipFiles(0)))
                If Not String.IsNullOrEmpty(characterName) Then
                    NombrePersonaje.Text = characterName
                End If

                Dim skinType = GetSkinTypeFromFileName(Path.GetFileName(zipFiles(0)))
                If Not String.IsNullOrEmpty(skinType) Then
                    SetTypeSelector(skinType)
                End If

                Dim skinNumber = GetSkinNumberFromFileName(Path.GetFileName(zipFiles(0)))
                SetSkinNumberSelector(skinNumber)
            Else
                MessageBox.Show("Por favor, arrastra uno o más archivos .zip válidos.")
            End If
        End If
    End Sub


    Private Sub TypeSelector_SelectedIndexChanged(sender As Object, e As EventArgs) Handles TypeSelector.SelectedIndexChanged

        If TypeSelector.SelectedIndex = 0 Then
            SpecialSelectorNumber.Enabled = False
            SpecialSelectorNumber.Visible = False
            LabelNumeroSkin.Visible = False
        ElseIf TypeSelector.SelectedIndex = 1 Then
            SpecialSelectorNumber.Enabled = True
            SpecialSelectorNumber.Visible = True
            LabelNumeroSkin.Visible = True
        End If

        UpdateLostButton1Visibility()


    End Sub

    Private Sub RutaArchivoBox_TextChanged(sender As Object, e As EventArgs) Handles RutaArchivoBox.TextChanged
        UpdateLostButton1Visibility()
    End Sub

    Private Sub NombrePersonaje_TextChanged(sender As Object, e As EventArgs) Handles NombrePersonaje.TextChanged
        UpdateLostButton1Visibility()
    End Sub

    Private Sub UpdateLostButton1Visibility()
        LostButton1.Visible = Not String.IsNullOrEmpty(RutaArchivoBox.Text) AndAlso
                          NombrePersonaje.Text.Length > 2 AndAlso
                          (TypeSelector.SelectedIndex = 0 Or TypeSelector.SelectedIndex = 1)
    End Sub

End Class

